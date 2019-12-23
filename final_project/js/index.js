/**
 * @author Haotian Wang
 * @email hautian@umich.edu
 */

class ItemsView {
    /**
     * Sort key
     * @type {string}
     */
    sortKey = '';

    /**
     * Whether to sort in ascending order
     * @type {boolean}
     */
    sortOrder = true;

    /**
     * View class for index.html
     * @param {Item[]} items An array of Item objects
     */
    constructor(items) {
        this.items = items;
        this.resetBrands();
        this.renderItems();
    }

    /**
     * Reset brand filter
     */
    resetBrands() {
        var brands = new Set(this.items.map(item => item.brand));
        for(let brand of brands) {
            $("#brand").append($("<option>").val(brand).text(brand));
        }
    };

    /**
     * Search if keywords exist in the document
     * @param {string} document The document to search
     * @param {string} query    The keywords to search
     * @returns {boolean}       Whether keywords exist in the document
     */
    searchKeywords(document, query) {
        document = document.toLowerCase();
        for(let keyword of query.split(' '))
            if(document.indexOf(keyword.toLowerCase()) < 0)
                return false;
        return true;
    }

    /**
     * Filter items
     * @param {Item[]} items     The items to be filtered
     * @param {string} keywords  Keywords of the title
     * @param {string} brand     Brand
     * @param {Number} min_price Minimum price
     * @param {Number} max_price Maximum price
     * @returns {Item[]}         Filtered items
     */
    filterItems(items, keywords, brand, min_price, max_price) {
        var filtered_items = [];
        for(let item of this.items) {
            if(keywords && !this.searchKeywords(item.title, keywords))
                continue;
            // filter brand and rating
            if(brand && item.brand !== brand)
                continue;
            // filter minimum price
            if(!isNaN(min_price) && (item.prices.length === 0 || Math.max.apply(null, item.prices) < min_price))
                continue;
            // filter maximum price
            if(!isNaN(max_price) && (item.prices.length === 0 || Math.min.apply(null, item.prices) > max_price))
                continue;
            filtered_items.push(item);
        }
        return filtered_items;
    }

    /**
     * Sort items
     * @param {Item[]} items      The items to be sorted
     * @param {string} sortKey    Sort key: "title", "rating", "totalReviews", and "prices"
     * @param {boolean} sortOrder Whether to sort in ascending order
     * @returns {Item[]}          Sorted items
     */
    sortItems(items, sortKey, sortOrder) {
        function generateCompareFunction(sortKey, sortOrder) {
            if(sortKey === "title") {
                let compare = function (a, b) {
                    return a[sortKey].toLowerCase() < b[sortKey].toLowerCase() ? -1 : 1;
                };
                return sortOrder? compare: (a, b) => -compare(a, b);
            } else if(sortKey === "prices") {
                if(sortOrder)
                    return function (a, b) {
                        let minPriceA = a[sortKey].length > 0? Math.min.apply(null, a.prices): Infinity;
                        let minPriceB = b[sortKey].length > 0? Math.min.apply(null, b.prices): Infinity;
                        return minPriceA - minPriceB;
                    };
                else
                    return function (a, b) {
                        let maxPriceA = a[sortKey].length > 0? Math.max.apply(null, a.prices): 0;
                        let maxPriceB = b[sortKey].length > 0? Math.max.apply(null, b.prices): 0;
                        return maxPriceB - maxPriceA;
                    }
            } else {
                let compare = function (a, b) {
                    return a[sortKey] - b[sortKey];
                };
                return sortOrder ? compare : (a, b) => -compare(a, b);
            }
        }
        return items.sort(generateCompareFunction(sortKey, sortOrder));
    }

    /**
     * Switch sort buttons between "Name", "Reviewers", "Rating", and "Price", when clicked
     * @param selected Selected button (a jQuery object)
     */
    switchSortButtons(selected) {
        for(let button of $("#btn-sort button")) {
            if(button === selected[0]) {
                let icon = button.children[0];
                let font = icon.getAttribute("class");
                let sort = button.getAttribute("value").split('-');
                this.sortKey = sort[0];
                this.sortOrder = sort[1] === "ascending";
                // click the same button
                if(button.getAttribute("class") === "btn btn-info") {
                    // reverse icon
                    icon.setAttribute("class", font.indexOf("-alt") > 0 ? font.replace("-alt", "") : font + "-alt");
                    // reverse sort order
                    this.sortOrder = !this.sortOrder;
                    if(this.sortOrder)
                        button.setAttribute("value", button.getAttribute("value").replace("descending", "ascending"));
                    else
                        button.setAttribute("value", button.getAttribute("value").replace("ascending", "descending"));
                } else {
                    button.setAttribute("class", "btn btn-info");
                }
            } else {
                button.setAttribute("class", "btn btn-secondary");
            }
        }
    }

    /**
     * Render items to the DOM
     */
    renderItems() {
        var keywords = $("#keywords").val();
        var brand = $("#brand option:selected").val();
        var min_price = parseInt($("#min_price").val());
        var max_price = parseInt($("#max_price").val());
        var items = this.filterItems(this.items, keywords, brand, min_price, max_price);
        items = this.sortItems(items, this.sortKey, this.sortOrder);
        var products = $("#products");
        products.empty();
        for(let item of items) {
            let next = "details.html?asin=" + item.asin;
            let div = $("<div>");
            div.append($("<a class='img-link'>").attr("href", next).append(
                $("<img>").attr("alt", item.title).attr("src", item.image)
            ));
            div.append($("<a>").attr("href", next).text(item.title));
            if(item.prices.length > 0)
                div.append($("<p>").html(`<b>Price</b>: $${Math.min.apply(null, item.prices)} - $${Math.max.apply(null, item.prices)}`));
            div.append($("<p>").html(`<b>Average Rating</b>: ${item.rating}`));
            div.append($("<p>").html(`<b>Total Reviewers</b>: ${item.totalReviews}`));
            products.append(div);
        }
    }
}

$(document).ready(function() {
    var itemsView = null;
    $.get("data/items.csv", function(data) {
        var items = Papa.parse(data).data.slice(1).map(item => new Item(item));
        itemsView = new ItemsView(items);
        $(".loading").css("display", "none");
        $(".footer").css("position", "unset");
    });
    $("#filter").click(function () {
        itemsView.renderItems();
        return false;
    });
    $("#reset").click(function () {
        $("#keywords").val("");
        $("#brand").val("");
        $("#min_price").val("");
        $("#max_price").val("");
        itemsView.sortKey = '';
        itemsView.switchSortButtons($());
        itemsView.renderItems();
        return false;
    });

    $("#sort-by-name").click(function() {
        itemsView.switchSortButtons($("#sort-by-name"));
        itemsView.renderItems();
        return false;
    });

    $("#sort-by-reviewers").click(function() {
        itemsView.switchSortButtons($("#sort-by-reviewers"));
        itemsView.renderItems();
        return false;
    });

    $("#sort-by-rating").click(function() {
        itemsView.switchSortButtons($("#sort-by-rating"));
        itemsView.renderItems();
        return false;
    });

    $("#sort-by-price").click(function() {
        itemsView.switchSortButtons($("#sort-by-price"));
        itemsView.renderItems();
        return false;
    });
});
