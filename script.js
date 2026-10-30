// init
let el = document.getElementById("canvas")
side = el.clientWidth
let zoom = 1
let unit = (side / 10) * zoom
function setup() {
    createCanvas(side, side).parent("canvas")
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
    stroke("green")
    strokeWeight(3)
    line(0, side / 2, side, side / 2)//x axis
    line(side / 2, 0, side / 2, side)//y axis

    strokeWeight(1)

    let n_lines = Math.floor(side / (2 * unit));
    for (let i = 1; i <= n_lines; i++) {
        // y grid lines
        line(0, side / 2 + i * unit, side, side / 2 + i * unit);
        line(0, side / 2 - i * unit, side, side / 2 - i * unit);

        // x grid lines
        line(side / 2 + i * unit, 0, side / 2 + i * unit, side);
        line(side / 2 - i * unit, 0, side / 2 - i * unit, side);
    }
}


v1 = new makeVector(2, 3)
console.log(v1.magnitude)

function draw() {
    background("#E5CBBA")
    renderGraph()
}