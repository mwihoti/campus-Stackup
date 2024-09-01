use serde:: {
    Serialize, Deserialize
};


#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RustSingleCycle {
    pub release_date: Option<String>,
    pub  eol: bool,
    pub  latest: Option<String>,
    pub latest_release_date: Option<String>,
    pub lts: bool
}