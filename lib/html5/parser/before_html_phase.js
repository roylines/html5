var Phase = require('html5/parser/phase').Phase;

exports.Phase = p = function BeforeHtmlPhase(parser, tree) {
	Phase.call(this, parser, tree);
	this.name = 'before_html_phase'
}

p.prototype = new Phase;

p.prototype.process_eof = function() {
	this.insert_html_element();
	this.parser.phase.process_eof();
}

p.prototype.processComment = function(data) {
	this.tree.insert_comment(data, this.tree.document);
}

p.prototype.processSpaceCharacters = function(data) {
}

p.prototype.processCharacters = function(data) {
	this.insert_html_element();
	this.parser.phase.process_eof();
}

p.prototype.processStartTag = function(name, attributes, self_closing) {
	if(name == 'html') this.parser.first_start_tag = true;
	this.insert_html_element();
	this.parser.phase.processStartTag(name, attributes);
}

p.prototype.processEndTag = function(name) {
	this.insert_html_element();
	this.parser.phase.processEndTag(name);
}

p.prototype.insert_html_element = function() {
	var element = this.tree.createElement('html', {});
	this.tree.open_elements.push(element);
	this.tree.document.appendChild(element);
	this.parser.newPhase('beforeHead');
}