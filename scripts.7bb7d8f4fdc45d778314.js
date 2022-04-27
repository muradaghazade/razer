try {
    const e = window.document.getElementsByName("occ-backend-base-url")[0].getAttribute("content");
    let t = document.createElement("script");
    t = document.createElement("link"), t.setAttribute("rel", "dns-prefetch"), t.setAttribute("href", e), window.document.head.appendChild(t)
} catch (err) {
    console.error(err)
}
document.addEventListener("click", (function(e) {
    if (e.target.matches("a.newsletter-link")) return e.preventDefault(), void dispatchEvent(new Event("clickedNewsletter"));
    e.target.matches("label.footer-label") && e.target.parentNode.querySelector(".collapsible-content").classList.toggle("show")
}), !1), document.addEventListener("changeRegion", (function(e) {
    var t = setInterval((function() {
        var n = document.querySelector(".country-placeholder");
        n && (n.textContent = e.detail.regionInfo.country.name, clearInterval(t))
    }), 300)
}));
const HATCH_CID_COOKIE = "h_cid";

function getHatchCid() {
    var e = window.location.href,
        t = new RegExp("[?&#]cid(=([^&#]*)|&|#|$)").exec(e);
    return t && t[2] ? decodeURIComponent(t[2]) : null
}
var cid = getHatchCid();
if (null !== cid) {
    var now = new Date,
        expireDate = new Date(now.getTime() + 2592e6);
    document.cookie = "h_cid=" + encodeURIComponent(cid) + "; expires=" + expireDate.toUTCString() + ";"
}