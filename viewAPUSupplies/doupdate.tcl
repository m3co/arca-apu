
namespace eval viewAPUSupplies {

  proc 'do'update { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]
    variable frame

    set keynote_frame $frame.[regsub -all {[.]} $row(Keynotes_id) "_"]
    if { [winfo exists $keynote_frame] == 1 } {
      $keynote_frame configure -text $row(Keynotes_id)
    } else {
      return
    }
    if { $row(APU_id) != "" } {
      set apu_frame $keynote_frame.apu_$row(APU_id)
      if { [winfo exists $apu_frame] == 1 } {
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_description \
          frame $apu_frame.apu_description \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_unit \
          frame $apu_frame.extras.apu_unit \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_cost \
          frame $apu_frame.extras.apu_cost \
          dollar true \
          currency true \
        ]
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_qop \
          frame $apu_frame.extras.apu_qop \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key Qtakeoff_qop \
          frame $apu_frame.extras.qtakeoff_qop \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row]

        if { $row(APUSupplies_id) != "" } {
          foreach param [list action type description unit cost partial qop] {
            if { $param == "partial" } {
              continue
            }
            if { $param == "action" } {
              continue
            }
            $apu_frame.supplies.$param configure -text $param
          }
        }
      }

      if { $row(APUSupplies_id) != "" } {
        if { [winfo exists $apu_frame.supplies.description.$row(APUSupplies_id)] == 1 } {
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key Supplies_description \
          frame $apu_frame.supplies.description.$row(APUSupplies_id) \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row]
        }

        if { [winfo exists $apu_frame.supplies.unit.$row(APUSupplies_id)] == 1 } {
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key Supplies_unit \
          frame $apu_frame.supplies.unit.$row(APUSupplies_id) \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row]
        }

        if { [winfo exists $apu_frame.supplies.cost.$row(APUSupplies_id)] == 1 } {
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key Supplies_cost \
          frame $apu_frame.supplies.cost.$row(APUSupplies_id) \
          dollar true \
          currency true \
        ]
        labelentry::setup [array get conf] [array get row]
        }

        if { [winfo exists $apu_frame.supplies.qop.$row(APUSupplies_id)] == 1 } {
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APUSupplies_qop \
          frame $apu_frame.supplies.qop.$row(APUSupplies_id) \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row]
        }
      }
    }
  }

}
