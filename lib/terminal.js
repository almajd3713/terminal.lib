
class Terminal {
	constructor({
		target,
		backgroundColor = "#111",
		color = "#279c10",
		fontSize = "2.5rem",
		fontFamily = "monospace"
		} = {}) {
		if(target) {this.target = target} else {setTimeout(() => {console.clear();console.error("ERR: No Target Specified In Terminal Definition")},10)}
		this.timer = 0;

		// initializing the terminal
		this.target.innerHTML += `<div class="terminal"></div>`
		this.panel = target.firstElementChild

		// for confirmation panels
		this.confirmPanelCount = 0

		// for prompting panels
		this.promptPanelCount = 0
		
		document.querySelector("head").innerHTML += 
		`<style>
			.terminal {
				width:100%;
				height: 100%;
				background-color:${backgroundColor};
				color:${color};
				font-size:${fontSize};
				font-family:${fontFamily};
				padding: 2rem 3rem;
			}

			::selection {
				background-color: ${color};
				color: ${backgroundColor};
			}


			.terminal__print {
				margin-bottom:0.75rem;
			}

			.terminal__print::last-child {
				margin-bottom:0;
			}

			.container {
				width: 100%;
				height: 100%;
			}

			.terminal__input {
				background-color: inherit;
				font: inherit;
				color: inherit;
				padding: inherit;
				margin-left: 0.2rem;
				outline: none;
				border: none;
				display: inline-block;
				cursor: default;
			}
		</style>`
	}

	static createNode({tag = "p", classes = [], inpType = "text", text = "", subNodes = []} = {}) {
		let el = document.createElement(tag)
		if (text.length > 0) el.textContent = text
		if (classes.length > 0) {
			classes.forEach((item) => {
				el.classList.add(item)
			})
		}
		if (tag === "input") el.type = inpType
		if (subNodes.length > 0) {
			subNodes.forEach((child) => {
		 		let childEl = this.createNode({
		 			tag: child.tag,
		 			classes: child.classes,
		 			inpType: child.inpType,
		 			text: child.text,
		 			subNodes: child.subNodes
		 		})
		 		el.appendChild(childEl)
			})
		}
		return el
	}

	print(text,time) {
		time ? this.timer += time : this.timer += 1000
		if(text) {
			setTimeout(() => {
				this.panel.appendChild(this.constructor.createNode({
					tag: "p",
					text: text,
					classes: ["terminal__print"]
				}))
			},this.timer)
		} else {
	 	  console.error("no text specified")
		}
	}

	confirm({text = "confirm ?",time = 1000,callbackY = () => console.log("no callback on true is defined !"), callbackN = () => console.log("no callback on false is defined !")} = {}) {
		this.timer += time
		setTimeout(() => {
			this.panel.appendChild(this.constructor.createNode({
				tag: "div",
				classes: ["terminal__confirm"],
				subNodes: [
					{tag: "p", classes: ["terminal__print"], text: `${text} (Y/N)  `, subNodes: [{tag: "input", classes: ["terminal__input"], type: "text"}]}
				]
			}))

			let confirmPanelTable = this.panel.querySelectorAll(".terminal__confirm")
			let confirmPanel = confirmPanelTable[this.confirmPanelCount]
			this.confirmPanelCount += 1
			let inputForm = confirmPanel.querySelector(".terminal__input")
			let submitValue = ""
			inputForm.focus()
			
			inputForm.addEventListener("keydown", (event) => {
				if(event.keyCode === 13) {
					if(inputForm.value === "y" || inputForm.value === "Y") {
						callbackY()
					} else if(inputForm.value === "n" || inputForm.value === "N"){
						callbackN()
					} else {
						this.confirm({text,time,callbackY,callbackN})
					}
				inputForm.disabled = true
				}
			})
		},this.timer)
	}

	prompt({prefix = "Anonymous => ", time = 50, commands = {test: () => console.log("ITS ALIVE!")}, reUse = {mode: false, time: 1500}} = {}) {
		this.timer += time
		setTimeout(() => {
			this.panel.appendChild(
				this.constructor.createNode({
					tag: "div",
					classes: ["terminal__prompt"],
					subNodes: [
						{tag:"p",classes: ["terminal__print"],text: prefix, subNodes: [{tag:"input",classes:["terminal__input"],type:"text"}]}
					]
				})
			)

			let promptPanelTable = this.panel.querySelectorAll(".terminal__prompt")
			let promptPanel = promptPanelTable[this.promptPanelCount]
			this.promptPanelCount += 1
			let inputForm = promptPanel.querySelector(".terminal__input")
			let submitValue = ""
			inputForm.focus()

			let commandArr = Object.keys(commands)

			inputForm.addEventListener("keydown", (event) => {
				if(event.keyCode === 13) {
					let commandCount = commandArr.length
					let wrongCommandCount = 0
					for(let x = 0; x < commandCount; x ++) {
						if(commandArr[x] === inputForm.value) {
							commands[commandArr[x]]()
							let reUseMode = reUse.mode
							let reUseTime = reUse.time
							if(reUseMode === true) {this.prompt({prefix, reUseTime, commands, reUse})}
						} else {
							wrongCommandCount += 1
						}
					}
					
					if(wrongCommandCount === commandCount) {
						this.prompt({prefix, time, commands, reUse})
					}
					inputForm.disabled = true
				}
			})
		},this.timer)
	}
}