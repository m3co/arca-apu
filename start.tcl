
package require BWidget
source [file join [file dirname [info script]] "m3co/main.tcl"]

#
# MAIN - es para conectarse, definir chan y delegar los eventos
#
# Variables
#  chan - channel o canal de conexion TCP
#
#  leftPanel - el frame izquierdo
#  centerPanel - el frame del centro
#
# Procedimientos
#  handle'event
#

namespace eval MAIN {
  connect [namespace current]

  wm title . "Listado APU"
  wm geometry . "800x600+100+10"
  # Configure el Layout inicial
  set main [ScrolledWindow .scrolledwindow]
  pack $main -fill both -expand true
  $main setwidget [ScrollableFrame $main.scrollableframe \
    -constrainedheight true -constrainedwidth true]
  set frame [$main.scrollableframe getframe]
  update

  proc subscribe { } {
    variable chan

    set event {{
      "module": "Projects",
      "query": "subscribe"
    }}
    chan puts $chan [regsub -all {\n} $event {}]

    set event {{
      "module": "fnConcretizeAPU",
      "query": "subscribe"
    }}
    chan puts $chan [regsub -all {\n} $event {}]

    set event {{
      "module": "viewAPUSupplies",
      "query": "subscribe"
    }}
    chan puts $chan [regsub -all {\n} $event {}]

    set event {{
      "module": "Supplies",
      "query": "subscribe"
    }}
    chan puts $chan [regsub -all {\n} $event {}]
  }
  subscribe
}

source [file join [file dirname [info script]] projects.tcl]
source [file join [file dirname [info script]] fnConcretize.tcl]
source [file join [file dirname [info script]] viewAPUSupplies/viewAPUSupplies.tcl]
