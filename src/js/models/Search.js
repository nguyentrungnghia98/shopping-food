import axios from "axios";
import { key } from "../config/config";
export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResult() {
    try {
      console.log(key);
      const res = await axios(
        `http://food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}
