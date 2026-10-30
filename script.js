// init
function setup() {

}

// To make vectors in the format (a + ib)
function makeVector(a = 0, b = 0) {
    this.real_coff = a;
    this.img_coff = b;
    this.magnitude = Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5)
    this.argument = Math.atan2(b, a)
    this.print_output = function () {
        return this.real_coff + " + " + this.img_coff + "i";
    }
}

//To render grid
function renderGraph() {

}

v1 = new makeVector(2, 3)
console.log(v1.magnitude)

function draw() {

}