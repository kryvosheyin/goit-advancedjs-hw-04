import{a as m,S as b,i as h}from"./assets/vendor-c493984e.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const f of r.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&a(f)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();m.defaults.baseURL="https://pixabay.com/api/";m.defaults.headers=["Access-Control-Allow-Origin"];const w="44478278-1149efa35d94f549e3de6ad11",p=document.querySelector(".search-form"),y=document.getElementById("results"),c=document.getElementById("scroll-anchor");let n=0,l=1,g=0,i;const L=new b(".gallery-link",{captionsData:"alt",captionDelay:100,close:!1,showCounter:!1,animationSlide:!1,fadeSpeed:250}),d=(o,t)=>{const s=o==="warning"?"orange":"green";h.show({title:t,backgroundColor:s,titleColor:"white",position:"topRight"})},C=o=>o.map(t=>`
  <div class="image-card">
    <a class="gallery-link" href="${t.largeImageURL}">
      <img src="${t.previewURL}" alt="${t.tags}" />
    </a>
    <div class="image-metadata">
      ${["likes","views","comments","downloads"].map(s=>`
        <div class="metadata">
          <p class="label">${s.charAt(0).toUpperCase()+s.slice(1)}</p>
          <p>${t[s]}</p>
        </div>`).join("")}
    </div>
  </div>
`).join(""),v=async(o,t,s)=>{try{const a=await m.get("",{params:{key:w,q:o,image_type:"photo",per_page:40,page:t,orientation:"horizontal",safesearch:!0}}),e=a.data.hits;if(n=a.data.totalHits,g+=e.length,console.log(e),n===0){d("warning","Sorry, there are no images matching your search query. Please try again");return}const r=C(e);if(y.insertAdjacentHTML("beforeend",r),L.refresh(),n-g<=0){d("warning","You have reached the end of the search results"),u.unobserve(c);return}}catch(a){console.error("Error getting the data from Pixabay: ",a),h.error({title:"Error",message:"Failed to fetch data, please try again",position:"topRight"})}},u=new IntersectionObserver(o=>{o[0].isIntersecting&&(n<=40?u.unobserve(c):(l++,v(i,l)))},{root:null,rootMargin:"0px",threshold:1});p.addEventListener("submit",async o=>{if(o.preventDefault(),u.unobserve(c),i=new FormData(p).get("searchQuery").trim(),!i){d("warning","Please enter the search query");return}l=1,g=0,y.innerHTML="",await v(i,l),n>0&&(d("success",`Hooray! We found ${n} images for your search`),u.observe(c))});
//# sourceMappingURL=commonHelpers.js.map
