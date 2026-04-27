let arr = [], steps = [], iStep = 0, playing = false, timer = null;

function generate() {
    arr = [];
    steps = [];
    iStep = 0;

    for (let i = 0; i < 10; i++) {
        arr.push(Math.floor(Math.random() * 90) + 10);
    }

    draw(arr);
    resetStats("Generated Array");
}

function useInput() {
    let input = document.getElementById("manualInput").value;
    let values = input.split(",").map(x => Number(x.trim()));

    if (values.some(isNaN) || values.length === 0) {
        alert("Invalid input");
        return;
    }

    arr = values;
    steps = [];
    iStep = 0;

    draw(arr);
    resetStats("Manual Input Array");
}

function resetStats(msg) {
    stopPlay();

    document.getElementById("status").innerText =
        msg + ": [" + arr.join(", ") + "]";

    document.getElementById("stats").innerHTML =
        "Comparisons: 0 | Moves: 0 <br> Time Complexity: - | Space Complexity: O(1)";
}

function draw(a) {
    let d = document.getElementById("array");
    d.innerHTML = "";

    a.forEach(v => {
        let c = document.createElement("div");
        c.className = "bar-container";

        c.innerHTML = `
            <div class="value">${v}</div>
            <div class="bar" style="height:${v * 3}px"></div>
        `;

        d.appendChild(c);
    });
}

function record(a, c, m) {
    steps.push({
        array: [...a],
        comparisons: c,
        moves: m
    });
}

function start() {
    stopPlay();
    steps = [];

    let algo = document.getElementById("algorithm").value;
    let a = [...arr];
    let comp = 0, moves = 0;

    if (algo === "bubble") {
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a.length - i - 1; j++) {
                comp++;

                if (a[j] > a[j + 1]) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                    moves++;
                }

                record(a, comp, moves);
            }
        }
    }

    else if (algo === "selection") {
        for (let i = 0; i < a.length - 1; i++) {
            let min = i;

            for (let j = i + 1; j < a.length; j++) {
                comp++;

                if (a[j] < a[min]) {
                    min = j;
                }

                record(a, comp, moves);
            }

            if (min !== i) {
                [a[i], a[min]] = [a[min], a[i]];
                moves++;
                record(a, comp, moves);
            }
        }
    }

    else if (algo === "insertion") {
        for (let i = 1; i < a.length; i++) {
            let key = a[i];
            let j = i - 1;

            while (j >= 0 && a[j] > key) {
                comp++;
                a[j + 1] = a[j];
                moves++;
                record(a, comp, moves);
                j--;
            }

            if (j >= 0) comp++;

            a[j + 1] = key;
            record(a, comp, moves);
        }
    }

    iStep = 0;
    playing = true;
    play();
}

function showStep(index) {
    if (index < 0 || index >= steps.length) return;

    let step = steps[index];
    draw(step.array);

    document.getElementById("status").innerText =
        "Step " + (index + 1) + ": [" + step.array.join(", ") + "]";

    document.getElementById("stats").innerHTML =
        `Comparisons: ${step.comparisons} | Moves: ${step.moves}<br>
         Time Complexity: O(n²) | Space Complexity: O(1)`;
}

function play() {
    if (!playing) return;

    if (iStep >= steps.length) {
        document.getElementById("status").innerText = "Sorting Completed!";
        playing = false;
        return;
    }

    showStep(iStep);
    iStep++;

    timer = setTimeout(play, document.getElementById("speed").value);
}

function stopPlay() {
    playing = false;

    if (timer) {
        clearTimeout(timer);
    }
}

function next() {
    stopPlay();

    if (iStep < steps.length) {
        showStep(iStep);
        iStep++;
    }
}

function prev() {
    stopPlay();

    if (iStep > 1) {
        iStep -= 2;
        showStep(iStep);
        iStep++;
    }
}

generate();