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
function renderGraph(theta = 0, scaling = 1) {
    push()
    translate(side / 2, side / 2)
    rotate(radians(theta))
    unit = unit * scaling
    let origin = side / 2 * Math.SQRT2

    stroke("green")
    strokeWeight(3)
    line(-origin, 0, origin, 0) //x axis
    line(0, -origin, 0, origin) //y axis

    strokeWeight(1)
    let n_lines = Math.ceil((side * Math.SQRT2) / (unit * scaling));
    for (let i = 1; i <= n_lines; i++) {
        // Horizontal grid lines
        line(-origin, i * unit, origin, i * unit);
        line(-origin, -i * unit, origin, -i * unit);
        // Vertical grid lines
        line(i * unit, -origin, i * unit, origin);
        line(-i * unit, -origin, -i * unit, origin);
    }

    pop();
}

v1 = new makeVector(2, 3)
console.log(v1.magnitude)

//animate
counter = 1;
function draw() {
    background("#E5CBBA")
    renderGraph(counter, 1)
    counter = counter + 0.25
}