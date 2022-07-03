let obj = [{
        name: "folder",
        children: [{
            name: "file.txt"
        }]
    },
    {
        name: "another folder",
        children: [{
                name: "file.js"
            },
            {
                name: "file.py"
            }
        ]
    },
    {
        name: "yes",
        children: [{
            name: "main.py"
        }]
    }
];

let nodeCount = 0;

function TreeView(parentId, name, children) {
    this.parent_id = parentId;
    this.name = name;
    this.children = children;
}

TreeView.prototype.printTree = function() {
    var parentElem = document.getElementById(this.parent_id);
    var holdElem = document.createElement("div");
    nodeCount++;
    holdElem.id = nodeCount;
    holdElem.classList.add('child');
    holdElem.setAttribute('draggable', true);
    holdElem.addEventListener('dragstart', handleDragStart);
    var childElem = document.createElement('div');
    childElem.innerText = this.name;
    childElem.classList.add("editbox");
    childElem.setAttribute("contenteditable", true);
    holdElem.appendChild(childElem);

    if (parentElem !== null) {
        parentElem.appendChild(holdElem);
        parentElem.addEventListener('drop', handleOnDrop);
        parentElem.addEventListener('dragover', dragover);
        parentElem.addEventListener('dragleave', dragleave);
    }

    if (this.children && this.children.length > 0) {
        var current = nodeCount;
        for (var i = 0; i < this.children.length; i++) {
            var childObj = new TreeView(current, this.children[i].name, this.children[i].children);
            childObj.printTree();
        }
    }
    setOutput();
}

function createTree() {
    return new TreeView(null, "root", obj).printTree();
}

function createNode() {
    return new TreeView(1, "New Node", []).printTree();
}

function dragover(event) {
    event.preventDefault();
    if (event.target.classList.contains("editbox")) {
        event.target.parentElement.classList.add("mouseover");
    } else {
        event.target.classList.add("mouseover");
    }
}

function dragleave(event) {
    if (event.target.classList.contains("editbox")) {
        event.target.parentElement.classList.remove("mouseover");
    } else {
        event.target.classList.remove("mouseover");
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function garbage(event) {
    event.preventDefault();
    dragging.remove();
}

let dragging = null;

function handleDragStart(event) {
    dragging = event.target;
}

function setOutput() {
    var output = document.getElementById("output");
    var root = document.getElementById("1");
    output.innerHTML = "root\n" + getBranch(root, -1);
}

function getBranch(branch, depth, index) {
    var output = "";
    depth++;
    for (var i = 1; i < branch.children.length; i++) {
        if (depth > 0) {
            if (document.getElementById("1").children.length - 1 == index) {
                output += `${"  ".repeat(depth)}`;
            } else {
                output += `│${" ".repeat(depth*2-1)}`;
            }
        }
        if (i == branch.children.length - 1) {
            output += "└─" + branch.children[i].firstChild.innerText + "\n";
        } else {
            output += "├─" + branch.children[i].firstChild.innerText + "\n";
        }
        if (branch.children[i].children.length > 1) {
            output += getBranch(branch.children[i], depth, i);
        }
    }
    return output;
}

function handleOnDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains("editbox")) {
        event.target.parentElement.classList.remove("mouseover");
        if (event.target != dragging) {
            event.target.parentElement.appendChild(dragging);
        }
    } else {
        event.target.classList.remove("mouseover");
        if (event.target != dragging) {
            event.target.appendChild(dragging);
        }
    }
    setOutput();
}