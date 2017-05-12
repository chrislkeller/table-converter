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
    this.id                     = "table";
    this.classname              = "table";
    this.columnDelimiter        = "\t";
    this.rowDelimiter           = "\n";
    this.inputTextArea          = $("#dataInput");
    this.outputTextArea         = $("#dataOutput");
    this.dataSelect             = $("#dataSelector");
    this.previewDiv             = "#preview";
    this.inputText              = "";
    this.outputText             = "";
    this.newLine                = "\n";
    this.indent                 = "    ";
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



        console.log(parseOutput);



        var dataGrid = parseOutput.dataGrid;
        var headerNames = parseOutput.headerNames;
        var headerTypes = parseOutput.headerTypes;
        var errors = parseOutput.errors;
        this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine, this.id, this.classname);
        var styles = "";
        styles += "<style type=\"text/css\">\n";
        styles += "\ttable {text-align: left; max-width: 650px; width: 100%; background-color: transparent; border-collapse: collapse; border-spacing: 0; border-color: #CCC; margin: 50px auto; font-family: 'Benton Gothic Regular', Arial, sans-serif; font-size: 15px;}\n";
        styles += "\ttable th {text-transform: capitalize;}\n";
        styles += "\ttable td mark {display: none;}\n";
        styles += "\ttable tr td:first-child mark {display: none;}\n";
        styles += "\t@media screen and (max-width: 550px){\n";
        styles += "\t\ttable {border-top: 3px solid #4591B8; width: 100%;}\n";
        styles += "\t\ttable thead {display: none;}\n";
        styles += "\t\ttable tbody, table tr, {width: 100%}\n";
        styles += "\t\ttable td {display: block; padding: 10px 5px 10px 5px;}\n";
        styles += "\t\ttable td mark {display: inline; background: none; color: #282828; }\n";
        styles += "\t\ttable td mark:after {content: \": \"; }\n";
        styles += "\t\ttable tr td:first-child {background: none; font-weight: 600; font-size: 1.1em; border-bottom-color: #808080; padding-top: 15px;}\n";
        styles += "\t\ttable tr td:nth-child(2) {padding-top: 10px;}\n";
        styles += "\t\ttable tr td:last-child {padding-bottom: 20px;}\n";
        styles += "\t}\n";
        styles += "</style>\n";
        var scripts = "";
        // if (this.sortable) {
        //     scripts += "<script type=\"text/javascript\" src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js\></script>\n";
        // };
        // scripts += "<script type=\"text/javascript\">\n";
        // if (this.sortable) {
        //     scripts += "$(\"#table-1\").tablesorter("+ JSON.stringify(this.sortOptions) + ");\n";
        // };
        // scripts += "</script>\n";
        if (scripts.length > 0){
            this.outputTextArea.val(errors + styles + scripts + this.outputText);
        } else {
            this.outputTextArea.val(errors + styles + this.outputText);
        };
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
