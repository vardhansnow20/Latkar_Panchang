
import { chromium } from "playwright-core"
const CHROME = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`
const b = await chromium.launch({ executablePath: CHROME, headless: true })
let fails = 0
for (const lang of ["en","mr"]) {
for (const [w,h] of [[375,812],[768,1024],[1440,900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } })
  await ctx.addInitScript(l => localStorage.setItem("klp.language", l), lang)
  const p = await ctx.newPage()
  await p.goto("http://localhost:4174/kolhapur-latkar-panchang/", { waitUntil: "networkidle" })
  const ids = await p.evaluate(() => [...document.querySelectorAll("main > section")].map((s,i)=>s.id||("band"+i)))
  const issues = []
  for (const id of ids) {
    await p.evaluate((i) => {
      const el = document.getElementById(i) || document.querySelectorAll("main > section")[0]
      if (el) window.scrollTo({ top: Math.max(el.offsetTop - 80, 0), behavior: "instant" })
    }, id)
    await p.waitForTimeout(120)
    const r = await p.evaluate((i) => {
      const sec = document.getElementById(i); if (!sec) return []
      const bad = []
      const vis = el => { const q=el.getBoundingClientRect(); const cs=getComputedStyle(el)
        return q.width>0&&q.height>0&&cs.visibility!=="hidden"&&parseFloat(cs.opacity)>0.05 }
      for (const el of sec.querySelectorAll("h1,h2,h3,p,li,dd,figcaption")) {
        if (el.children.length) continue
        // Content inside a closed <details> still reports a rect in
        // Chrome but is never painted. Verified by screenshot.
        const d = el.closest("details"); if (d && !d.open) continue
        const t=(el.textContent||"").trim(); if(!t||!vis(el)) continue
        const q=el.getBoundingClientRect()
        let n=el.parentElement
        while (n && n!==document.body) {
          const cs=getComputedStyle(n)
          const scrollsX = cs.overflowX==="auto"||cs.overflowX==="scroll"
          const scrollsY = cs.overflowY==="auto"||cs.overflowY==="scroll"
          if (cs.overflowX!=="visible"||cs.overflowY!=="visible") {
            const p2=n.getBoundingClientRect()
            // Only a hard clip counts: a scrollable axis is reachable.
            const cutY = !scrollsY && (q.bottom>p2.bottom+2 || q.top<p2.top-2)
            const cutX = !scrollsX && (q.right>p2.right+2 || q.left<p2.left-2)
            if (cutY||cutX) bad.push({sec:i,t:t.slice(0,40),cutX,cutY,by:(n.getAttribute("class")||n.tagName).slice(0,34)})
            break
          }
          n=n.parentElement
        }
      }
      return bad
    }, id)
    issues.push(...r)
  }
  // Rail overlap check, measured at rest.
  await p.evaluate(()=>window.scrollTo({top:0,behavior:"instant"})); await p.waitForTimeout(150)
  const ov = await p.evaluate(() => {
    const links=[...document.querySelectorAll('nav[aria-label] a')]
    const o=[]
    for(let i=0;i<links.length;i++)for(let j=i+1;j<links.length;j++){
      const a=links[i].getBoundingClientRect(), c=links[j].getBoundingClientRect()
      if(!a.width||!c.width)continue
      const ox=Math.min(a.right,c.right)-Math.max(a.left,c.left)
      const oy=Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top)
      if(ox>2&&oy>2)o.push({a:links[i].textContent.trim().slice(0,20),b:links[j].textContent.trim().slice(0,20),ox:Math.round(ox),oy:Math.round(oy)})
    }
    return o
  })
  const bad = issues.length + ov.length
  if (bad) fails++
  console.log(`${bad?"FAIL":"PASS"} ${lang} ${w}x${h}  clipped=${issues.length} navOverlaps=${ov.length}`)
  for (const c of issues.slice(0,6)) console.log(`   CLIP ${c.cutX?"X":""}${c.cutY?"Y":""} [${c.sec}] "${c.t}" by .${c.by}`)
  for (const o of ov.slice(0,4)) console.log(`   NAV OVERLAP ${o.ox}x${o.oy} "${o.a}" ~ "${o.b}"`)
  await ctx.close()
}}
await b.close()
console.log(fails? `\n${fails} combination(s) with findings` : "\nAll clean")
