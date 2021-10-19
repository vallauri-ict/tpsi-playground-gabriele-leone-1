import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
import * as querystring from "query-string";
import states from "./states.json"
import HEADERS from "./headers.json";
let paginaErrore: string;
import radios from "./radios.json";

export class Utility {
    stationCount() {
        _fs.readFile("./states.json", function (err, data) {
            if (err) {
                console.error(err);
                return;
            } else {
                // restituisce data come file binario -> applico .toString()
                // console.log(data.toString());
                elabora(JSON.parse(data.toString()));
            }
        });
    }
}

function elabora(states) {
    for (const state of states) {
        state.stationcount="0"
    }
    for (const state of states) {
        for (const radio of radios) {
            if (radio.state == state.value) {
                state.stationcount = (parseInt(state.stationcount) + 1).toString();
            }
        }
    }
    _fs.writeFile("./states.json", JSON.stringify(states), function (err) {
        if (err) {
            console.error(err);
            return;
        }
        else {
            console.log("File salvato corretamente");
        }
    });
}
