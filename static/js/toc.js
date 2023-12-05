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