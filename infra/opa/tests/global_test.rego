package policy

test_allow_small_discount {
  allow with input as {"action":"apply_discount","params":{"percent":4}}
}

test_block_big_discount_without_approval {
  not allow with input as {"action":"apply_discount","params":{"percent":9}}
}
