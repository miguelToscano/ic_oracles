use crate::domain::requests::Request;
use std::collections::HashMap;

#[derive(Default)]
pub struct Requests(HashMap<String, Request>);

impl Requests {
    pub fn archive(&mut self) -> Vec<(String, Request)> {
        let map = std::mem::replace(&mut self.0, HashMap::new());
        map.into_iter().collect()
    }

    pub fn load(&mut self, archive: Vec<(String, Request)>) {
        self.0 = archive.into_iter().collect();
    }

    pub fn create(&mut self, api_key: &Request) -> Result<(), ()> {
        self.0.insert(api_key.clone().id, api_key.clone());
        Ok(())
    }

    pub fn delete(&mut self, id: String) -> Result<(), ()> {
        self.0.remove(&id);
        Ok(())
    }

    pub fn get(&self, id: String) -> Option<Request> {
        self.0.get(&id).cloned()
    }

    pub fn get_all(&self) -> Vec<Request> {
        self.0.clone().into_values().collect()
    }
}
