use endoflife::rust::{self, RustSingleCycle};

use serde_json;

fn main() {
    let json_str: &str = r#"
    {
    "releaseDate": "2024-05-02",
    "eol": false,
    "latest": "1.78.0",
    "latestReleaseDate": "2024-05-02",
    "lts": false
    }"#;

    let json_object: Result<RustSingleCycle, Error > = serde_json::from_str::<rust::RustSingleCycle>

    println!(
        *{:?}*,
        json_object
    )

    let new_json_str : Result<{unknown}, Error> = serde_json::from_value(value)
}
