import functionPlot from "function-plot";

export function formatFloat(decimal, numberOfDigits){
    return parseFloat(decimal.toFixed(numberOfDigits))
}

export function fnEval(fn, xVal, yVal) {
    
    const datum = {
        fn: fn
    }

    let scope = {}

    const isNotDefinedX = xVal === undefined;
    const isNotDefinedY = yVal === undefined;

    if (!isNotDefinedX)
        scope.x = xVal;

    if (!isNotDefinedY)
        scope.y = yVal;

    return functionPlot.$eval.builtIn(datum, 'fn', scope)
}

export function eulerMethod(fn, a, b, ya, M){
    let h = (b-a)/M;
    let xs = [];
    let ys = [];

    let points = [];
    for (let i = 0; i <= M; ++i)
    {
        xs.push(0);
        ys.push(0);
    }

    xs[0] = 0;
    for (let i = 0; i <= M; ++i)
        xs[i + 1] = xs[i] + h;
    
    ys[0] = ya;
    for (let i = 0; i <= M; ++i)
    {
        const fnResult = fnEval(fn, xs[i], ys[i]);
        ys[i+1] = ys[i] + h * fnResult;
    }

    for (let i = 0; i <= M; ++i)
    {
        const point = [xs[i], ys[i]];
        points.push(point);
    }

    return points;
}

export function trapezeMethod(a, b, M, fn){

    console.log("Input Trapeze Method", [a,b,M,fn]);

    if (a === 0 && b === 0)
        return {points : [], area : 0, squares : []};

    let h = (b-a)/M;
    let fa = fnEval(fn, a);
    let fb = fnEval(fn, b);

    let ret = (h/2)*(fa+fb);
    
    let sum = 0;

    let points = []
    let squares = []

    let initPoint = [0, fnEval(fn, 0)];

    points.push(initPoint);

    console.log("Points: ", points);

    for(let i=1; i <= M; i++){

        const xi = a + i*h;
        const yi = fnEval(fn, xi);
        sum += yi;
        points.push([xi, yi])

        if (i <= M)
        {
            const prevPoint = points[i - 1];
            const currPoint = points[i];

            console.log("Previous Point: ", prevPoint);

            squares.push([prevPoint[0], 0]);
            squares.push([prevPoint[0], prevPoint[1]]);
            squares.push([currPoint[0], currPoint[1]]);
            squares.push([currPoint[0], 0]);

            // squares.push(prevPoint)
            // squares.push([prevPoint[1], currPoint[1]])
            // squares.push([currPoint[1], currPoint[0]]);

            console.log("Squares: ", squares);
        }
    }

    const area = (ret + (h)*sum)
    return {points, area, squares}
}


export function rungeKutta(fn, a, b, ya, M){
    let h = (b-a)/M;
    let xs = [];
    let ys = [];

    let points = [];
    for (let i = 0; i <= M; ++i)
    {
        xs.push(0);
        ys.push(0);
    }

    xs[0] = 0;
    for (let i = 0; i <= M; ++i)
        xs[i + 1] = xs[i] + h;
    
    ys[0] = ya;

    for (let i = 0; i <= M; ++i)
    {
        let k1 = h * (fnEval(fn, xs[i], ys[i]));
        let k2 = h * (fnEval(fn, xs[i] + h/2, ys[i] + (k1/2) ));
        let k3 = h * (fnEval(fn, xs[i] + h/2, ys[i] + (k2/2) ));
        let k4 = h * (fnEval(fn, xs[i] + h, ys[i] + k3));

        ys[i+1] = ys[i] + ( (k1 + (2*k2) + (2*k3) + k4) / 6 )
    }

    for (let i = 0; i <= M; ++i)
    {
        const point = [xs[i], ys[i]];
        points.push(point);
    }



    return points;
}