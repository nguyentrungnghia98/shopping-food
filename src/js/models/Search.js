import axios from "axios";
import { proxy, key } from "../config/key";
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResult() {
    try {
      const res = await axios(
        `${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}
