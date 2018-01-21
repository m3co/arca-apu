package require json::write
json::write indented 0

namespace eval Projects {

  proc create'combobox { frame } {
    set combo [ttk::combobox $frame.combo]
    bind $combo <KeyRelease> +[list \
      Projects::search'combobox %W %K]
    bind $combo <<ComboboxSelected>> [list \
      Projects::select'combobox %W]

    pack $combo -side left
    extendcombo::setup $combo
    focus $combo
  }

  proc search'combobox { path key } {
    set value [$path get]

    set event [dict create \
      query [json::write string search] \
      combo [json::write string $path] \
      module [json::write string Projects] \
      key [json::write string name] \
      value [json::write string $value] \
    ]
    chan puts $MAIN::chan [json::write object {*}$event]
  }

  proc select'combobox { path } {
    variable frame
    destroy $frame.body
    set id [lindex [regexp -inline {\[(\d+)\]$} [$path get]] end]

    pack [frame $frame.body -bg green] -fill both -expand true
    fnConcretizeAPU::open $frame.body $id
  }

  array set lastSearch {}
  set frame $MAIN::frame
  pack [frame $frame.actions] -fill x
  pack [frame $frame.body] -fill both -expand true
  create'combobox $frame.actions
}

proc Projects::'do'search { resp } {
  upvar $resp response
  variable lastSearch

  array unset lastSearch
  array set lastSearch {}
  set found [list]

  foreach row $response(rows) {
    array set entry [deserialize $row]
    lappend found "$entry(name) \[$entry(id)]"
    set lastSearch($entry(id)) [array get entry]
  }
  if { [llength $found] == 0 } {
    set r [lindex [regexp -inline {(.+) [[]\d+[]]$} $response(value)] end]
    if { $r == "" } {
      lappend found $response(value)
    }
  }
  $response(combo) configure -values $found
  extendcombo::show'listbox $response(combo) ""
}

proc Projects::'do'select { resp } {
  upvar $resp response
  parray response
}
