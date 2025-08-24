package policy

default allow = false

# Example: disallow discounts > 7% without approval
allow {
  input.action == "apply_discount"
  percent := input.params.percent
  percent <= 5
}

allow {
  input.action == "share_case_study"
  not input.params.contains_other_client_names
}

# Allow general read actions
allow {
  input.action == "read_status"
}
