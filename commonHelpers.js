import{a as f,i as y,S as b}from"./assets/vendor-c493984e.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const d of e.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function a(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function o(t){if(t.ep)return;t.ep=!0;const e=a(t);fetch(t.href,e)}})();f.defaults.baseURL="https://pixabay.com/api/";f.defaults.headers=["Access-Control-Allow-Origin"];const w="44478278-1149efa35d94f549e3de6ad11",h=document.querySelector(".search-form"),g=document.getElementById("results"),u=document.getElementById("scroll-anchor");let n=0,l=1,i,p;const c=(r,s)=>{const a=r==="warning"?"orange":"green";y.show({title:s,backgroundColor:a,titleColor:"white",position:"topRight"})},v=async(r,s)=>{try{const a=await f.get("",{params:{key:w,q:r,image_type:"photo",per_page:40,page:s}}),o=a.data.hits;if(n=a.data.totalHits,console.log(o),o.length===0){c("warning","Sorry, there are no images matching your search query. Please try again");return}const t=o.map(e=>`<div class="image-card">
            <a class="gallery-link" href="${e.largeImageURL}">
            <img
            src="${e.previewURL}"
            alt="${e.tags}"
            />
            </a>
            <div class="image-metadata">
            <div class="metadata">
            <p class="label">Likes</p>
            <p>${e.likes}</p>
            </div>
            <div class="metadata">
            <p class="label">Views</p>
            <p>${e.views}</p>
            </div>
            <div class="metadata">
            <p class="label">Comments</p>
            <p>${e.comments}</p>
            </div>
            <div class="metadata">
            <p class="label">Downloads</p>
            <p>${e.downloads}</p>
            </div>
            </div>
            </div>`).join("");g.innerHTML+=t,p?p.refresh():p=new b(".gallery-link",{captionsData:"alt",captionDelay:100,close:!1,showCounter:!1,animationSlide:!1,fadeSpeed:250})}catch(a){console.error("Error getting the data from Pixabay: ",a),y.error({title:Error,message:"Failed to fetch data, please try again",position:"topRight"})}},m=new IntersectionObserver(r=>{r[0].isIntersecting&&(g.childElementCount+40>=n?(c("warning","You have reached the end of the search results"),m.unobserve(u)):(l++,v(i,l)))},{root:null,rootMargin:"0px",threshold:1});h.addEventListener("submit",async r=>{r.preventDefault(),m.unobserve(u),i=new FormData(h).get("searchQuery"),l=1,i?(g.innerHTML="",await v(i,l),n>0&&(c("success",`Hooray! We found ${n} images for your search`),m.observe(u))):c("warning","Please enter the search query")});
//# sourceMappingURL=commonHelpers.js.map
