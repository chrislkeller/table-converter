//
//  DataConverter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//  Modified by Kevin Schaul.
//

function DataConverter(nodeId) {
    //---------------------------------------
    // PUBLIC PROPERTIES
    //---------------------------------------
    this.outputDataTypes = [
        {"text":"HTML", "id":"html", "notes":""},
    ];
    this.outputDataType         = "html";
    this.id                     = "table-1";
    this.columnDelimiter        = "\t";
    this.rowDelimiter           = "\n";
    this.inputTextArea          = $("#dataInput");
    this.outputTextArea         = $("#dataOutput");
    this.dataSelect             = $("#dataSelector");
    this.previewDiv             = "#preview";
    this.inputText              = "";
    this.outputText             = "";
    this.newLine                = "\n";
    this.indent                 = "  ";
    this.commentLine            = "//";
    this.commentLineEnd         = "";
    this.tableName              = "MrDataConverter"
    this.useUnderscores         = true;
    this.headersProvided        = true;
    this.downcaseHeaders        = false;
    this.upcaseHeaders          = false;
    this.includeWhiteSpace      = true;
    this.useTabsForIndent       = false;
    this.sortable               = true;
    this.sortColumn             = 0;
    this.sortOrder              = 0;
    this.sortOptions            = {sortOrder: [[0,0]]};
};

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(){
    var self = this;
    this.outputTextArea.click(function(evt){
        this.select();
    });
    $("#dataInput").keyup(function() {
        self.convert();
    });
    $("#dataInput").change(function() {
        self.convert();
    });
    $("#dataSelector").bind("change",function(evt){
        self.outputDataType = $(this).val();
        self.convert();
    });
    $("#select-sort").change(function() {
        self.sortColumn = $("#select-sort").val();
        self.sort();
    });
    $("#select-sort-order").change(function() {
        self.sortOrder = $("#select-sort-order").val();
        self.sort();
    });
    $("#checkbox-sortable").change(function() {
        self.sortable = $("#checkbox-sortable").val();
        self.sort();
    });
};

DataConverter.prototype.convert = function(){
    this.inputText = this.inputTextArea.val();
    this.outputText = "";
    if (this.inputText.length > 0) {
        if (this.includeWhiteSpace) {
            this.newLine = "\n";
        } else {
            this.indent = "";
            this.newLine = "";
        }
        CSVParser.resetLog();
        var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);
        var dataGrid = parseOutput.dataGrid;
        var headerNames = parseOutput.headerNames;
        var headerTypes = parseOutput.headerTypes;
        var errors = parseOutput.errors;
        this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine, this.id);
        var styles = "";
        styles += "<style type=\"text/css\">\n";
        styles += "\ttable {text-align: left; border-collapse: collapse; margin:0 0 14px 0; width: 100%;}\n";
        styles += "\ttable th {text-transform: capitalize;}\n";
        styles += "\ttable td mark {display: none;}\n";
        styles += "\ttable tr td:first-child mark {display: none;}\n";
        styles += "\ttbody tr:nth-child(odd) td, tbody tr.odd td {background-color: #eee;}\n";
        styles += "\t@media screen and (max-width: 550px){\n";
        styles += "\t\ttable {border-top: 3px solid #4591B8; width: 100%;}\n";
        styles += "\t\ttable thead {display: none;}\n";
        styles += "\t\ttable tbody, table tr, {width: 100%}\n";
        styles += "\t\ttable tbody tr:nth-child(odd) td, table tbody tr.odd td {background-color: #eee;}\n";
        styles += "\t\ttable td {display: block; padding: 10px 5px 10px 5px;}\n";
        styles += "\t\ttable td mark {display: inline; background: none; color: #D17333; }\n";
        styles += "\t\ttable td mark:after {content: \": \"; margin-right: 50%; }\n";
        styles += "\t\ttable tr td:first-child {background: none; font-weight: 800; font-size: 1.0em; border-bottom-color: #808080; padding-top: 15px;}\n";
        styles += "\t\ttable tr td:nth-child(2) {padding-top: 10px;}\n";
        styles += "\t\ttable tr td:last-child {padding-bottom: 20px;}\n";
        styles += "\t}\n";
        styles += "</style>\n";
        var scripts = "";
        if (this.sortable) {
            scripts += "<script type=\"text/javascript\" src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js\></script>\n";
        };
        scripts += "<script type=\"text/javascript\">\n";
        if (this.sortable) {
            scripts += "$(\"#table-1\").tablesorter("+ JSON.stringify(this.sortOptions) + ");\n";
        };
        scripts += "</script>\n";
        this.outputTextArea.val(errors + styles + scripts + this.outputText);
        $(this.previewDiv).html(this.outputText);
    };
    //TODO if we want to sort..
    var selectOptions = "";
    for (i in headerNames){
        selectOptions += "<option value=\"" + i + "\">" + headerNames[i] + "</option>";
    };
    $("#select-sort").html(selectOptions);
    this.sort();
};

DataConverter.prototype.sort = function(){
    //TODO sorting breaks even/odd classes
    //TODO is this the correct way to do checkboxes?
    if (this.sortable === "on") {
        this.sortOptions = {
            sortList: [
                [this.sortColumn, this.sortOrder]
            ]
        };
        $("#table-1").tablesorter(this.sortOptions);
    }
    //TODO else refresh content from input (overrides preview sort
};
