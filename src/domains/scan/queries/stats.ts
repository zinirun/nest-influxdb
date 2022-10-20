export const STATS_BY_SERIAL = (serial: string) => `
import "math"

dataSet =
    from(bucket: "test")
        |> range(start: 0)
        |> filter(fn: (r) => r["_measurement"] == "measurement1")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["serial"] == "${serial}")

constH = 83.14472
constD = 10000.0
constR = constH / constD
constK = 273.15

dataSet
    |> reduce(
        fn: (r, accumulator) =>
            ({
                count: accumulator.count + 1,
                sum: accumulator.sum + r._value,
                avg: float(v: accumulator.sum + r._value) / float(v: accumulator.count + 1),
                _convSum: accumulator._convSum + math.exp(x: (-constH) / (constR * (r._value + constK))),
                mkt:
                    constD / (-math.log(
                            x:
                                (accumulator._convSum + math.exp(x: (-constH) / (constR * (r._value + constK))))
                                    /
                                    float(v: accumulator.count + 1),
                        )) - constK,
            }),
        identity: {
            count: 0,
            sum: 0.0,
            avg: 0.0,
            _convSum: 0.0,
            mkt: 0.0,
        },
    )
`;
