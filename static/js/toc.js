function toggle_toc() {
    const toc = document.getElementById("toc-nav");
    const toc_button = document.getElementById("page-header-toc-button");

    if (toc.style.display === "none") {
        toc.style.display = "";
        toc_button.style.display = "none";
    } else {
        toc.style.display = "none";
        toc_button.style.display = "block";
    }
}

const collapse_button_element = document.createElement("button");
collapse_button_element.className = "collapse-button";
const collapse_button_span = document.createElement("span");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
if (prefersDark.matches) {
    collapse_button_span.style.backgroundImage = "url(/images/other/collapse-button-dark.svg)";
} else {
    collapse_button_span.style.backgroundImage = "url(/images/other/collapse-button-light.svg)";
}
collapse_button_element.appendChild(collapse_button_span);

const toc = document.getElementById("TableOfContents");
const toc_list = toc.querySelector("ul");
toc_list.querySelectorAll("li").forEach( item => {
    let nested_uls = item.getElementsByTagName("ul");
    if (nested_uls.length > 0) {
        const collapse_button = collapse_button_element.cloneNode(true);
        collapse_button.addEventListener("click", function() {
            let collapse_button_span = collapse_button.querySelector("span");

            let first_ul = nested_uls[0];
            if (first_ul.style.display === "") {
                first_ul.style.display = "none";
                collapse_button_span.className = "collapsed";
            } else {
                first_ul.style.display = "";
                collapse_button_span.className = "";
            }
        });
        item.insertBefore(collapse_button, item.childNodes[0]);
    }
});