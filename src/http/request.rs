use std::{collections::HashMap, str::FromStr};

#[derive(Debug)]
pub struct HttpRequest {
    method: Method,
    route: Resource,
    version: Version,
    header: HttpHeader,
    request_body: String
}


#[derive(Debug)]
struct HttpHeader {
    headers: HashMap<String, String>
}

impl HttpHeader {
    pub fn new(request: &str) -> Option<HttpHeader> {
        let mut httpheader = HttpHeader {
            headers: HashMap::new()
        };
        let (_, header_str) = request.split_once("\r\n")?;

        for line in header_str.split_terminator("\r\n") {
            if line.is_empty() {
                break;
            }
            let (header, value) = line.split_once(":")?;
            httpheader
                .headers
                .insert(header.trim().to_string(), value.trim().to_string());
        }
        Some(httpheader)
    }
}

#[derive(Debug)]
enum Version {
    V1_1,
    V2_0
}

#[derive(Debug)]
struct VersionError {
    msg: String
}

impl Display for VersionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.msg)
    }
}

imp Version {
    pub fn (request: &str) -> Result<Self, VersionError> {
        Version::from_str(request)
    }
}

impl FromStr for Version {
    type Err = VersionError;

    fn from_str(request:  &str) -> Result<Self, Self::Err> {
        let request = request.split_once("\r\n");
        if let Some((method_line, _rest)) = request_split {
            let splits = method_line.split_ascii_whitespace();

            for split in splits
            {
                if split == "HTTP/1.1" {
                    return Ok(Version::V1_1);

                } else if split == "HTTP/2" || split == "HTTP/2.0" {
                    return Ok(Version::V2_0)
                    
                };
            };
        }
        let invalid = format!("Unknown protocol version in {}", request);
        let version_error = VersionError { msg: invalid};
        Err(version_error)
    }
}

#[derive(Debug)]

enum Method {
    Get,
    Post,
    Uninitialised
}

impl Method {
    pub fn new(request: &str) -> Method {
        let request_split = request.split_once("\r\n");
        if let Some((method_line, _rest)) = request_split{
            let method_line: Option<(&str, &str)> = method_line.split_once(' ');
            if let Some((method, _rest )) = method_line {
                return match method {
                    "GET" => Method::Get,
                    "POST" => Method::Post,
                    _ => Method::Uninitialised
                };
            };
        };
        Method::Uninitialised
    }
    pub fn identify(s: &str) -> Method {
        match s {
            "GET" => Method::Get,
                    "POST" => Method::Post,
                    _ => Method::Uninitialised

        }
    }
}


#[derive(Debug)]

struct Resource {
    path: String
}



impl Resource {
    pub fn new(request: &str) -> Option<Resource> {
        if let Some((request_method, _)) = request.split_once("\r\n") {
            let (method, rest) = request_method.split_once(' ')?;
            return match Method::identify(method) {
                Method::Get | Method::Post => {
                    let (resource, _protcol_version) = rest.split_once(' ')?;
                    let resource = resource.trim();
                    let resource = resource.trim_start_matches('/');
                    return Some(Resource {
                        path: resource.to_string(),
                    });                     
                }
                Method::Uninitialised => None,
            }
        };
        None
    }
}
