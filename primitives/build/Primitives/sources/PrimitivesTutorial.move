address 0xCAFE {
module PrimitivesTutorial {
    use std::signer;
    use std::string;

    struct ExampleData has key {
        number: u64,
        status: bool,
        address: address,
        note: string::String,
    }

    public entry fun create_example_data(account: &signer, initial_number: u64, note: string::String) {
        move_to(account, ExampleData {
            number: initial_number,
            status: true,
            address: signer::address_of(account),
            note,
        });
    }

    #[view]
    public fun get_number(account: &signer): u64 acquires ExampleData {
        borrow_global<ExampleData>(signer::address_of(account)).number
    }

    public fun increment_number(account: &signer, increment: u64) acquires ExampleData {
        let example_data = borrow_global_mut<ExampleData>(signer::address_of(account));
        example_data.number = example_data.number + increment;
    }

    public fun toggle_status(account: &signer) acquires ExampleData {
        let example_data = borrow_global_mut<ExampleData>(signer::address_of(account));
        example_data.status = !example_data.status;
    }

    public fun is_even(number: u64): bool {
        number % 2 == 0
    }

    // Corrected Unit tests for the module
    #[test(account = @0xBEEF)]
    public fun test_create_and_get_example_data(account: &signer) acquires ExampleData {
        let initial_number = 25;
        let note = string::utf8(b"Hello there");
        create_example_data(account, initial_number, note);

        let example_data_number = get_number(account);
        if (example_data_number != initial_number) {
            abort 42
        }
    }

    #[test(account = @0xBEEF)]
    public fun test_increment_number(account: &signer) acquires ExampleData {
        let initial_number = 25;
        let increment = 10;
        let note = string::utf8(b"Hello there");
        create_example_data(account, initial_number, note);
        increment_number(account, increment);

        let new_number = get_number(account);
        if (new_number != initial_number + increment) {
            abort 43
        }
    }

    #[test(account = @0xBEEF)]
    public fun test_toggle_status(account: &signer) acquires ExampleData {
        let initial_number = 25;
        let note = string::utf8(b"Hello there");
        create_example_data(account, initial_number, note);
        toggle_status(account);

        let example_data = borrow_global<ExampleData>(signer::address_of(account));
        if (example_data.status) {
            abort 44
        }
    }

    #[test(account = @0xBEEF)]
    public fun test_is_even_function() {
        if (!is_even(2)) {
            abort 45
        };
        if (is_even(3)) {
            abort 46
        }
    }
}
}