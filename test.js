import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
import papaparse from "./papaparse.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
    duration: '30s',
    vus: 10,
  };


const csvData = new SharedArray('Ler dados', function(){
    return papaparse.parse(open('./usuarios.csv'), {header: true}).data;
});

export default function(){
    const BASE_URL = 'https://test-api.k6.io';
    const USER = csvData[Math.floor(Math.random() * csvData.length)].email
    const PASS = 'user123'

    const res = http.post(`${BASE_URL}/auth/token/login/`, {
            username: USER,
            password: PASS
    });
    check(res, {
        'sucesso login': (r) => r.status === 200,
    });
}
export function handleSummary(data) {
    const name = "_test";
    const fileName = "resultados/index" + name + ".html";  // Salvando na pasta 'resultados'
    return {
        [fileName]: htmlReport(data),
    };
}

