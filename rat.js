class Rat_js {
    constructor(el = false, a = 'all') {
        this.element = "";
        if (el != false) {
            if (typeof(el) == "string") {
                if (el.indexOf("#") > -1 && el.indexOf("#") == 0) {
                    this.element = document.getElementById(el.split("#")[1]);
                } else if (el.indexOf(".") > -1 && el.indexOf(".") == 0) {
                    if (a == 'all') {
                        this.element = Object.values(document.getElementsByClassName(el.split(".")[1]));
                    } else {
                        this.element = document.getElementsByClassName(el.split(".")[1])[a];
                    }
                } else if (el.indexOf("<>") > -1 && el.indexOf("<>") == 0) {
                    if (a == 'all') {
                        this.element = Object.values(document.getElementsByTagName(el.split("<>")[1]));
                    } else {
                        this.element = document.getElementsByTagName(el.split("<>")[1])[a];
                    }
                } else {
                    if (a == 'all') {
                        this.element = Object.values(document.getElementsByName(el));
                    } else {
                        this.element = document.getElementsByName(el)[a];
                    }
                }
            } else {
                this.element = el;
            }
        }

    }
    serialize() {
        let isi_form = Array.from(this.element.getElementsByTagName('input'));
        let isi_select = Array.from(this.element.getElementsByTagName('select'));
        let hasil_serialize = {};
        isi_form.forEach((isf) => {
            if (isf.getAttribute('type') != 'submit' && isf.getAttribute('type') != 'button' && isf.getAttribute('type') != 'reset') {
                if (isf.getAttribute('type') == 'radio') {
                    if (isf.checked == true) {
                        hasil_serialize[isf.getAttribute('name')] = isf.value;
                    }
                } else if (isf.getAttribute('type') == 'checkbox') {
                    if (isf.checked == true) {
                        if (isf.getAttribute('name').indexOf("[]") <= -1) {
                            hasil_serialize[isf.getAttribute('name')] = isf.value;
                        } else {
                            if (typeof(hasil_serialize[isf.getAttribute('name')]) == 'undefined') {
                                hasil_serialize[isf.getAttribute('name')] = [isf.value];
                            } else {
                                hasil_serialize[isf.getAttribute('name')].push(isf.value);
                            }
                        }
                    }
                } else if (isf.getAttribute('type') == 'file') {
                    hasil_serialize[isf.getAttribute('name')] = isf.files[0];
                } else {
                    hasil_serialize[isf.getAttribute('name')] = isf.value;
                }
            }
        });
        isi_select.forEach((isf) => {
            hasil_serialize[isf.getAttribute('name')] = isf.value;
        });
        return hasil_serialize;
    }
    ajax(par = { url: "", method: "GET", data: {}, form_data: {}, success, fail }) {
        var xhr = new XMLHttpRequest();
        if (par.data != undefined) {
            var key = Object.keys(par.data);
            var val = Object.values(par.data);
            var dt = [];
            for (let x = 0; x < key.length; x++) {
                if (Array.isArray(val[x])) {
                    val[x].forEach((v_x) => {
                        dt.push(key[x] + "=" + v_x);
                    });
                } else {
                    dt.push(key[x] + "=" + val[x]);
                }
            }
            dt = dt.join("&");
        } else if (par.form_data != undefined) {
            var key = Object.keys(par.form_data);
            var val = Object.values(par.form_data);
            var dt = new FormData();
            for (let x = 0; x < key.length; x++) {
                if (Array.isArray(val[x])) {
                    val[x].forEach((v_x) => {
                        dt.append(key[x], v_x);
                    });
                } else {
                    dt.append(key[x], val[x]);
                }

            }
        }
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (par.success != undefined) {
                        par.success(this.responseText, this.status);
                    }
                } else {
                    if (par.fail != undefined) {
                        par.fail(this.responseText, this.status);
                    }
                }
            }
        };
        xhr.open(par.method, par.url, true);
        if (par.method == undefined) {
            par.method = "GET";
        }
        if (par.method == "GET") {
            xhr.send();
        } else if (par.method == "POST" && par.data != undefined) {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(dt);
        } else if (par.method == "POST" && par.form_data != undefined) {
            xhr.send(dt);
        }
    }
    render_function(a) {
        if (this.element.length == 1) {
            let arg = this.element[0].attributes;
            let argumen_fungsi = a.toString().split("(")[1].split(")")[0].split(",");
            var hasil_ekstrak = [];

            var elemen_ini = this.element[0];
            for (let x = 0; x < argumen_fungsi.length; x++) {
                hasil_ekstrak.push(arg.getNamedItem(argumen_fungsi[x].trim()).value);
            }
            this.element[0].replaceWith(a.apply({ element: elemen_ini }, hasil_ekstrak));
        } else {
            for (let y = 0; y < this.element.length; y++) {
                let arg = this.element[y].attributes;
                let argumen_fungsi = a.toString().split("(")[1].split(")")[0].split(",");
                var hasil_ekstrak = [];

                var elemen_ini = this.element[y];
                for (let x = 0; x < argumen_fungsi.length; x++) {
                    hasil_ekstrak.push(arg.getNamedItem(argumen_fungsi[x].trim()).value);
                }
                this.element[y].replaceWith(a.apply({ element: elemen_ini }, hasil_ekstrak));


            }
        }
    }
    styles(a) {
        let abc = "";
        let atr = Object.keys(a);
        let nil = Object.values(a);
        for (let x = 0; x < atr.length; x++) {
            abc = abc + atr[x] + ":" + nil[x] + ";";
        }
        console.log(abc);
        if(Array.isArray(this.element)){
            this.element.forEach((el)=>{
                el.setAttribute('style',abc);
            })
        }
        else{
            this.element.setAttribute('style',abc);
        }
    }
    setRules(a = false) {
        if (a != false) {
            let rules = Object.keys(a);
            let fungsi = Object.values(a);
            let objek = [];
            for (let x = 0; x < rules.length; x++) {
                if (rules[x].indexOf(">") > -1) {
                    let isi_rules = rules[x].split(">");
                    if (isi_rules[0] == "w") {
                        objek.push(window.matchMedia("(min-width: " + isi_rules[1] + "px)"));
                    } else if (isi_rules[0] == "h") {
                        objek.push(window.matchMedia("(min-height: " + isi_rules[1] + "px)"));
                    }
                } else if (rules[x].indexOf("<") > -1) {
                    let isi_rules = rules[x].split("<");
                    if (isi_rules[0] == "w") {
                        objek.push(window.matchMedia("(max-width: " + isi_rules[1] + "px)"));
                    } else if (isi_rules[0] == "h") {
                        objek.push(window.matchMedia("(max-height: " + isi_rules[1] + "px)"));
                    }
                }

            }
            for (let x = 0; x < objek.length; x++) {
                objek[x].addListener(function() {
                    if (objek[x].matches) {
                        fungsi[x]();
                    }
                });
                if (objek[x].matches) {
                    fungsi[x]();
                }
            }
        }
    }
    child() {
        if (arguments.length > 0) {
            if(Array.isArray(this.element)){
                this.element.forEach((el)=>{
                    if(el.childNodes!=undefined){
                        let jumlah_elemen = Array.from(el.childNodes);
                        for (let x = 0; x < jumlah_elemen.length; x++) {
                            el.removeChild(jumlah_elemen[x])
                        }
                    }
                });
            }
            else{
                if(this.element.childNodes!=undefined){
                    let jumlah_elemen = Array.from(this.element.childNodes);
                    for (let x = 0; x < jumlah_elemen.length; x++) {
                        this.element.removeChild(jumlah_elemen[x])
                    }
                }
            }

            for (let x = 0; x < arguments.length; x++) {
                if (Array.isArray(arguments[x])) {
                    arguments[x].forEach((a) => {
                        if(Array.isArray(this.element)){
                            this.element.forEach((el)=>{
                                el.appendChild(a);
                            });
                        }
                        else{
                            this.element.appendChild(a);
                        }
                    })
                } else {
                    if(Array.isArray(this.element)){
                        this.element.forEach((el)=>{
                            el.appendChild(arguments[x]);
                        });
                    }
                    else{
                        this.element.appendChild(arguments[x]);
                    }

                }
            }
        } else {
            return this.element.childNodes;
        }

    }
    remove(a) {
        if (typeof(a) == 'object') {
            this.element.removeChild(a);
        } else if (typeof(a) == 'number') {
            this.element.removeChild(this.element.childNodes[a]);
        }
    }
    rmchild() {
        this.element.childNodes.forEach((ch) => {
            this.element.removeChild(ch);
        });

    }
    html(a = false) {
        if (a == false) {
            return this.element.innerHTML;
        } else {
            this.element.innerHTML = a;
        }
    }
    attr(a, b = false) {
        if (b == false) {
            return this.element.getAttribute(a);
        } else {
            if (a == 'checked') {
                if (b == 'false') {
                    this.element.checked = false;
                } else if (b == 'true') {
                    this.element.checked = true;
                }
            } else if (a == 'selected') {
                if (b == 'false') {
                    return this.element.selected = false;
                } else {
                    return this.element.selected = true;
                }
            } else {
                return this.element.setAttribute(a, b);
            }
        }
    }
    val(a = false) {
        if (a != false) {
            return this.element.value = a;
        } else {
            return this.element.value;
        }
    }
    append(a) {
        this.element.appendChild(a);
    }
    get(el) {
        if (typeof(el) == "string") {
            if (el.indexOf(".") > -1 && el.indexOf(".") == 0) {
                if (el.indexOf("::") <= -1) {
                    this.element = this.element.getElementsByClassName(el.split(".")[1]);
                } else {
                    this.element = this.element.getElementsByClassName(el.split(".")[1].split("::")[0])[parseInt(el.split("::")[1])];
                }
            } else if (el.indexOf("<>") > -1 && el.indexOf("<>") == 0) {
                if (el.indexOf("::") <= -1) {
                    this.element = this.element.getElementsByTagName(el.split("<>")[1]);
                } else {
                    this.element = this.element.getElementsByTagName(el.split("<>")[1].split("::")[0])[parseInt(el.split("::")[1])];
                }
            } else if (el.indexOf("#") > -1 && el.indexOf("#") == 0) {
                this.element = this.element.getElementById(el.split("#")[1])[0];
            }
        }
        return this;
    }
    cre(elemen, a = { attr: {}, child: [], event: {}, style: {} }) {
        let el = document.createElement(elemen);
        if (a.attr != undefined) {
            let attr_key = Object.keys(a.attr);
            let attr_val = Object.values(a.attr);
            for (let x = 0; x < attr_key.length; x++) {
                el.setAttribute(attr_key[x], attr_val[x]);
            }
        }
        if (a.child != undefined) {
            for (let x = 0; x < a.child.length; x++) {
                el.appendChild(a.child[x]);
            }
        }
        if (a.event != undefined) {
            let event_key = Object.keys(a.event);
            let event_val = Object.values(a.event);
            for (let x = 0; x < event_key.length; x++) {
                el.addEventListener(event_key[x], event_val[x]);
            }
        }
        if (a.style != undefined) {
            if (a.style.rules == undefined) {
                let abc = "";
                let atr = Object.keys(a.style);
                let nil = Object.values(a.style);
                for (let x = 0; x < atr.length; x++) {
                    abc = abc + atr[x] + ":" + nil[x] + ";";
                }
                el.setAttribute("style", abc);
            } else {
                let objek = [];
                let key = Object.keys(a.style.rules);
                let val = Object.values(a.style.rules);
                for (let x = 0; x < key.length; x++) {
                    if (key[x].indexOf(">") > -1) {
                        let isi_key = key[x].split(">");
                        if (isi_key[0] == "w") {
                            objek.push(window.matchMedia("(min-width: " + isi_key[1] + "px)"));
                        } else if (isi_key[0] == "h") {
                            objek.push(window.matchMedia("(min-height: " + isi_key[1] + "px)"));
                        }
                    } else if (key[x].indexOf("<") > -1) {
                        let isi_key = key[x].split("<");
                        if (isi_key[0] == "w") {
                            objek.push(window.matchMedia("(max-width: " + isi_key[1] + "px)"));
                        } else if (isi_key[0] == "h") {
                            objek.push(window.matchMedia("(max-height: " + isi_key[1] + "px)"));
                        }
                    }

                }
                for (let x = 0; x < objek.length; x++) {
                    objek[x].addListener(function() {
                        if (objek[x].matches) {
                            let isi_style = "";
                            let style_key = Object.keys(val[x]);
                            let style_val = Object.values(val[x]);
                            for (let y = 0; y < style_key.length; y++) {
                                isi_style = isi_style + style_key[y] + ":" + style_val[y] + ";"
                            }
                            el.setAttribute("style", isi_style);
                        }
                    });
                    if (objek[x].matches) {
                        let isi_style = "";
                        let style_key = Object.keys(val[x]);
                        let style_val = Object.values(val[x]);
                        for (let y = 0; y < style_key.length; y++) {
                            isi_style = isi_style + style_key[y] + ":" + style_val[y] + ";"
                        }
                        el.setAttribute("style", isi_style);
                    }
                }
            }
        }
        return el;
    }
    cre_text(text) {
        return document.createTextNode(text);
    }
    on(ev, f) {
        if (Array.isArray(this.element) == false) {
            this.element.addEventListener(ev, f);
        } else {
            let element = Object.values(this.element);
            for (let x = 0; x < element.length; x++) {
                element[x].addEventListener(ev, f);
            }
        }
    }
}


function R(el = false, ind = 'all') {
    let kl = new Rat_js(el, ind);
    return kl;
}