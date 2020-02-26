window.onload=function () {
    //identify the main place to draw.
    let playground = document.getElementById("playground");
    let selectedModel=undefined;
    document.addEventListener("keydown",(e)=>moveOrTransform(e,selectedModel));



    //all models will generate a copy in the drawing container after drag
    for(let elem of document.getElementsByClassName("model")){
        let shift=null;
        elem.addEventListener("dragstart",function (e) {
            let shiftX = e.clientX-elem.offsetLeft;
            let shiftY = e.clientY-elem.offsetTop;
            shift = {x:shiftX,y:shiftY};
        });
        elem.addEventListener("dragend",(e)=>copyAppearsIn(e,elem,playground,shift));
    }


    /*function to let an element have the focus and blur attribute
    * if the element is on blur, it will be transparent
    *  if it is on focus, the content will show.
    * */
    function makeFocusAndBlur(elem){
        elem.classList.add("focusBlur");
        elem.addEventListener ("focus",function(){
            elem.classList.remove("transferToTransParent");
        });
        elem.addEventListener("blur",  function () {
            elem.classList.add("transferToTransParent");
        });

    }



    //get a copy of whatever the input object including its css character
    function getCopy(object) {
        let elem = document.createElement(object.tagName);
        elem.innerHTML = object.innerHTML;
        elem.classList = object.classList;
        elem.classList.add("absolute_position");
        elem.classList.remove("model");
        elem.addEventListener("click",()=>selectedModel=elem);
        //special case
        if(elem.classList.contains("textInput")){
            makeFocusAndBlur(elem.firstElementChild);
        }
        if(elem.classList.contains("objectBox")){
            let inputText = elem.firstElementChild;
            let div = inputText.nextElementSibling;
            div.classList.add("borderBottom");
            inputText.onblur=function () {
                div.innerHTML = inputText.value;
                div.style.display="";
                inputText.style.display="none";
            };
            div.onclick = function () {
                div.style.display="none";
                inputText.style.display = "";
            };
        }

        if(elem.classList.contains("interfaceBox")||elem.classList.contains("classBox")){
            for(let inputText of elem.getElementsByClassName("switchInput")){
                let div = inputText.nextElementSibling;
                inputText.onblur=function () {

                    div.innerHTML = inputText.value;
                    div.style.display="";
                    inputText.style.display="none";
                };
                div.onclick = function () {
                    div.style.display="none";
                    inputText.style.display = "";
                };
            }
        }


        return elem;
    }

    /* get a copy of object in place, with a shift value*/
    function copyAppearsIn(e,object,place,shift){
        let copy = getCopy(object);
        place.appendChild(copy);
        let offsetX = place.offsetLeft + place.clientLeft;
        let offsetY = place.offsetTop + place.clientTop;
        let leftValue = e.clientX-offsetX-shift.x;
        let topValue = e.clientY-offsetY-shift.y;
        copy.style.left = leftValue+"px";
        copy.style.top = topValue+"px";
        makeTransformable(copy);
        makeDragableToMove(copy);
    }

    /*let the selected object be transformable, grow ,shrink, move*/
    function makeTransformable(object) {
        selectedModel = object;
    }


    /*move or change the size of an object when an key event e happens*/
    function moveOrTransform(e,object) {
        if(object==undefined) return;
        switch (e.keyCode) {
            case 38:
                e.preventDefault();
                object.style.top = object.offsetTop - 2 + "px";
                break;
            case 40:
                e.preventDefault();
                object.style.top = object.offsetTop + 2 + "px";
                break;
            case 37:
                e.preventDefault();
                object.style.left = object.offsetLeft - 2 + "px";
                break;
            case 39:
                e.preventDefault();
                object.style.left = object.offsetLeft + 2 + "px";
                break;
            case 187:
                e.preventDefault();
                grow(object); break;
            case 189:
                e.preventDefault();
                shrink(object); break;
            case 16:
                e.preventDefault();
                document.addEventListener("keydown",deleteWhenPressTwoKey);
                document.addEventListener("keyup", function r(e) {
                    if(e.keyCode==16){
                        document.removeEventListener("keydown",deleteWhenPressTwoKey);
                        selectedModel=null;
                    }
                });
                break;
        }
    }

    function deleteWhenPressTwoKey(e) {
            if(e.keyCode==8){
                del(selectedModel);
                selectedModel=null;
            }
    }

    function grow(object){
        if(object.classList.contains("width")) {
            if(object.classList.contains("textInput")){
                let elem = object.firstElementChild;
                elem.style.width = elem.offsetWidth+2+"px";
            }else {
                object.style.width = object.offsetWidth+2+"px";
            }

        }else if(object.classList.contains("height")) {
            object.style.height = object.offsetHeight+2+"px";
        }else if(object.classList.contains("dash")) {
            object.innerHTML += '|<br/>';
        }else if(object.classList.contains("arrow1")) {
            object.innerHTML = "----"+object.innerHTML;
        }else if(object.classList.contains("arrow2")||object.classList.contains("onlyDash")) {
            object.innerHTML = "-" + object.innerHTML;
        }else if(object.classList.contains("line")) {
            object.innerHTML = "-" + object.innerHTML;
        }else if(object.classList.contains("lineContainer")){
            let lineDiv = object.firstElementChild;
            lineDiv.style.width = lineDiv.offsetWidth + 2+"px";
        }

    }


    function shrink(object){
        if(object.classList.contains("width")) {
            if(object.classList.contains("textInput")){
                let elem = object.firstElementChild;
                elem.style.width = elem.offsetWidth*0.8+"px";
                object.style.width = object.offsetWidth*0.8+"px";
            }else {
                object.style.width = object.offsetWidth*0.8+"px";
            }
        }else if(object.classList.contains("height")) {
            object.style.height = object.offsetHeight*0.8+"px";
        }else if(object.classList.contains("dash")) {
            if(object.innerHTML!="") object.innerHTML="";
            object.innerHTML += '|<br/>';
        }else if(object.classList.contains("arrow1")) {
            if(object.innerHTML!="-------->") object.innerHTML="-------->";
                object.innerHTML = "-"+object.innerHTML;
        }else if(object.classList.contains("arrow2")) {
            if(object.innerHTML!="----->") object.innerHTML="----->";
                object.innerHTML = "-"+object.innerHTML;
        }else if(object.classList.contains("line")||object.classList.contains("onlyDash")){
            if(object.innerHTML!="-------") object.innerHTML="-------";
            object.innerHTML = "-"+object.innerHTML;
        }else if(object.classList.contains("lineContainer")){
            let lineDiv = object.firstElementChild;
            lineDiv.style.width = lineDiv.offsetWidth - 2+"px";
        }
    }



    function del(elem) {

        elem.parentElement.removeChild(elem);
    }

    function makeDragableToMove(elem) {
        elem.draggable = true;
        let startPoint=null;
        elem.addEventListener("dragstart",function (e) {

            startPoint = {x:e.clientX,y:e.clientY};
        });
        elem.addEventListener("dragend",(e)=>move(e,elem,startPoint));

    }

    function move(e,elem,start) {
        let wayGoneX = e.clientX -start.x;
        let wayGoneY = e.clientY - start.y;
        elem.style.left = elem.offsetLeft+wayGoneX+"px";
        elem.style.top = elem.offsetTop+wayGoneY+"px";
    }







/*bugs to be fixed   delete inputtext will delete elements*/












}