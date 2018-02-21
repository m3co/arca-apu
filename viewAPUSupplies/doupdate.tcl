
namespace eval viewAPUSupplies {

  proc 'do'update { resp } {
    variable description
    upvar $resp response
    array set row [deserialize $response(row)]
    variable frame
    if { [info exists frame] != 1 } {
      return
    }

    set keynote_frame $frame.[regsub -all {[.]} $row(APU_id) "_"]
    if { [winfo exists $keynote_frame] == 1 } {
      $keynote_frame configure -text $row(APU_id)
    } else {
      return
    }
    if { $row(APU_expand) == "false" } {
      set apu_frame $keynote_frame.apu_[regsub -all {[.]} $row(APU_id) "_"]
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
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_unit \
          frame $apu_frame.extras.apu_unit \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_cost \
          frame $apu_frame.extras.apu_cost \
          dollar true \
          currency true \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_qop \
          frame $apu_frame.extras.apu_qop \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        if { $row(APU_qop) != "null" } {
          if { $row(APU_qop) > 0 } {
            set inverse_qop [ expr { 1.0 / $row(APU_qop) }]
            if { [winfo exists $apu_frame.extras.apu_qop_inverse_text] == 0 } {
              pack [label $apu_frame.extras.apu_qop_inverse_text \
                -text ":: 1 / [expr { round($inverse_qop) }]"] \
                -side left
            } else {
              $apu_frame.extras.apu_qop_inverse_text configure \
                -text ":: 1 / [expr { round($inverse_qop) }]"
            }
          }
        }

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

      if { $row(APUSupplies_id) != "null" } {

        if { [winfo exists $apu_frame.supplies.type.$row(APUSupplies_id)] == 1 } {
        input'type [array get row] $apu_frame.supplies
        }
        if { [winfo exists $apu_frame.supplies.description.$row(APUSupplies_id)] == 1 } {
        input'description [array get row] $apu_frame.supplies
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
        labelentry::setup [array get conf] [array get row] [array get description]
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
        labelentry::setup [array get conf] [array get row] [array get description]
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
        labelentry::setup [array get conf] [array get row] [array get description]
        }

        if { [winfo exists $apu_frame.supplies.partial.$row(APUSupplies_id)] == 1 } {
          $apu_frame.supplies.partial.$row(APUSupplies_id).label configure -text \
          "\$[format'currency [ \
          expr { \
            ([isnumeric $row(APUSupplies_qop)] ? $row(APUSupplies_qop) : 0) * \
            ([isnumeric $row(Supplies_cost)] ? $row(Supplies_cost) : 0)} \
          ]]"
        }
      }
    }
  }

}
