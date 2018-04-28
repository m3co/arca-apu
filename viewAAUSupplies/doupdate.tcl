
namespace eval viewAAUSupplies {

  proc 'do'update { resp } {
    variable description
    upvar $resp response
    array set row [deserialize $response(row)]
    variable frame
    if { [info exists frame] != 1 } {
      return
    }

    set keynote_frame $frame.[regsub -all {[.]} $row(AAU_id) "_"]
    if { [winfo exists $keynote_frame] == 1 } {
      $keynote_frame configure -text $row(AAU_id)
    } else {
      return
    }
    if { $row(AAU_expand) == "false" } {
      set aau_frame $keynote_frame.aau_[regsub -all {[.]} $row(AAU_id) "_"]
      if { [winfo exists $aau_frame] == 1 } {
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_information \
          frame $aau_frame.aau_information \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_description \
          frame $aau_frame.aau_description \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_unit \
          frame $aau_frame.extras.aau_unit \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_cost \
          frame $aau_frame.extras.aau_cost \
          dollar true \
          currency true \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_qop \
          frame $aau_frame.extras.aau_qop \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]

        if { $row(AAU_qop) != "null" } {
          if { $row(AAU_qop) > 0 } {
            set inverse_qop [ expr { 1.0 / $row(AAU_qop) }]
            if { [winfo exists $aau_frame.extras.aau_qop_inverse_text] == 0 } {
              pack [label $aau_frame.extras.aau_qop_inverse_text \
                -text ":: 1 / [expr { round($inverse_qop) }]"] \
                -side left
            } else {
              $aau_frame.extras.aau_qop_inverse_text configure \
                -text ":: 1 / [expr { round($inverse_qop) }]"
            }
          }
        }

        if { $row(AAUSupplies_id) != "" } {
          foreach param [list action type description unit cost partial qop] {
            if { $param == "partial" } {
              continue
            }
            if { $param == "action" } {
              continue
            }
            $aau_frame.supplies.$param configure -text $param
          }
        }
      }

      if { $row(AAUSupplies_id) != "null" } {

        if { [winfo exists $aau_frame.supplies.type.$row(AAUSupplies_id)] == 1 } {
        input'type [array get row] $aau_frame.supplies
        }
        if { [winfo exists $aau_frame.supplies.description.$row(AAUSupplies_id)] == 1 } {
        input'description [array get row] $aau_frame.supplies
        }

        if { [winfo exists $aau_frame.supplies.unit.$row(AAUSupplies_id)] == 1 } {
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key Supplies_unit \
          frame $aau_frame.supplies.unit.$row(AAUSupplies_id) \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]
        }

        if { [winfo exists $aau_frame.supplies.cost.$row(AAUSupplies_id)] == 1 } {
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key Supplies_cost \
          frame $aau_frame.supplies.cost.$row(AAUSupplies_id) \
          dollar true \
          currency true \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]
        }

        if { [winfo exists $aau_frame.supplies.qop.$row(AAUSupplies_id)] == 1 } {
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAUSupplies_qop \
          frame $aau_frame.supplies.qop.$row(AAUSupplies_id) \
          dollar false \
          currency false \
        ]
        labelentry::setup [array get conf] [array get row] [array get description]
        }

        if { [winfo exists $aau_frame.supplies.partial.$row(AAUSupplies_id)] == 1 } {
          $aau_frame.supplies.partial.$row(AAUSupplies_id).label configure -text \
          "\$[format'currency [ \
          expr { \
            ([isnumeric $row(AAUSupplies_qop)] ? $row(AAUSupplies_qop) : 0) * \
            ([isnumeric $row(Supplies_cost)] ? $row(Supplies_cost) : 0)} \
          ]]"
        }
      }
    }
  }

}
