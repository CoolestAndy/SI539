/**
 * @author Haotian Wang
 * @email hautian@umich.edu
 */

class DetailsView {
    /**
     * View class for details.html
     * @param {Item} item        An item object
     * @param {Review[]} reviews An array of Review objects
     */
    constructor(item, reviews) {
        this.item = item;
        this.reviews = reviews;
        this.renderItem();
    }

    /**
     * Create rating buttons
     * @param {float} rating Rating value
     * @returns {HTMLElement} A jQuery DOM object
     */
    createRatingButton(rating) {
        var template = '<button type="button" aria-label="Left Align"><span class="glyphicon glyphicon-star" aria-hidden="true"></span></button>';
        var light = "btn btn-warning btn-xs";
        var dark = "btn btn-default btn-grey btn-xs";
        return $('<div class="review-block-rate">').append(
            rating >= 0.5? $(template).attr("class", light): $(template).attr("class", dark),
            rating >= 1.5? $(template).attr("class", light): $(template).attr("class", dark),
            rating >= 2.5? $(template).attr("class", light): $(template).attr("class", dark),
            rating >= 3.5? $(template).attr("class", light): $(template).attr("class", dark),
            rating >= 4.5? $(template).attr("class", light): $(template).attr("class", dark)
        );
    };

    /**
     * create review block
     * @param {Review} review A review object
     * @returns {HTMLElement} A jQuery DOM object
     */
    createReviewBlock(review) {
        var block = $('<div class="row">');
        block.append($('<div class="col-sm-2">').append(
            $('<div class="review-block-name">').text(review.name),
            $('<div class="review-block-date">').text(review.date),
        )).append($('<div class="col-sm-10">').append(
            this.createRatingButton(review.rating),
            $('<div class="review-block-title">').text(review.title),
            $('<div class="review-block-description">').text(review.body)
        ));
        return block;
    };

    /**
     * Render items to the DOM
     */
    renderItem() {
        $("#img").attr("alt", this.item.title).attr("src", this.item.image);
        $("#title-link").attr("href", this.item.url);
        $("#title").text(this.item.title);
        $("#rating").html(this.item.rating + "<small> / 5</small>");
        if(this.item.rating >= 4.5)
            $("#btn-rating-5").attr("class", "btn btn-warning btn-sm");
        else
            $("#btn-rating-5").attr("class", "btn btn-default btn-grey btn-sm");
        if(this.item.rating >= 3.5)
            $("#btn-rating-4").attr("class", "btn btn-warning btn-sm");
        else
            $("#btn-rating-4").attr("class", "btn btn-default btn-grey btn-sm");
        if(this.item.rating >= 2.5)
            $("#btn-rating-3").attr("class", "btn btn-warning btn-sm");
        else
            $("#btn-rating-3").attr("class", "btn btn-default btn-grey btn-sm");
        if(this.item.rating >= 1.5)
            $("#btn-rating-2").attr("class", "btn btn-warning btn-sm");
        else
            $("#btn-rating-2").attr("class", "btn btn-default btn-grey btn-sm");
        if(this.item.rating >= 0.5)
            $("#btn-rating-1").attr("class", "btn btn-warning btn-sm");
        else
            $("#btn-rating-1").attr("class", "btn btn-default btn-grey btn-sm");

        var ratingBreakdown = [0, 0, 0, 0, 0, 0];
        for(let review of this.reviews) {
            ratingBreakdown[review.rating]++;
        }
        var maxRatingBreakdown = Math.max.apply(null, ratingBreakdown);
        $("#progress-bar-rating-breakdown-1").css("width", ratingBreakdown[1] * 100 / maxRatingBreakdown + "%");
        $("#progress-bar-rating-breakdown-2").css("width", ratingBreakdown[2] * 100 / maxRatingBreakdown + "%");
        $("#progress-bar-rating-breakdown-3").css("width", ratingBreakdown[3] * 100 / maxRatingBreakdown + "%");
        $("#progress-bar-rating-breakdown-4").css("width", ratingBreakdown[4] * 100 / maxRatingBreakdown + "%");
        $("#progress-bar-rating-breakdown-5").css("width", ratingBreakdown[5] * 100 / maxRatingBreakdown + "%");
        $("#label-rating-breakdown-1").text(ratingBreakdown[1]);
        $("#label-rating-breakdown-2").text(ratingBreakdown[2]);
        $("#label-rating-breakdown-3").text(ratingBreakdown[3]);
        $("#label-rating-breakdown-4").text(ratingBreakdown[4]);
        $("#label-rating-breakdown-5").text(ratingBreakdown[5]);

        for(let i = 0; i < this.reviews.length; i++) {
            $("#review-block").append(this.createReviewBlock(this.reviews[i])).append('<hr>');
        }
    }
}

$(document).ready(function() {
    var asin = new URL(window.location.href).searchParams.get("asin");
    $.get("data/items.csv", function(data) {
        let items = Papa.parse(data).data.slice(1).map(item => new Item(item));
        var item = items.find(item => item.asin === asin);
        $.get("data/reviews.csv", function(data) {
            var reviews = Papa.parse(data).data.slice(1).map(review => new Review(review));
            reviews = reviews.filter(review => review.asin === asin);
            new DetailsView(item, reviews).renderItem();
            $(".footer").css("position", "unset");
        });
    });
});
