export const ROWS_BY_SERIAL = (serial: string) => `
from(bucket: "test")
    |> range(start: 0)
    |> filter(fn: (r) => r["_measurement"] == "measurement1")
    |> filter(fn: (r) => r["_field"] == "value")
    |> filter(fn: (r) => r["serial"] == "${serial}")
`;
