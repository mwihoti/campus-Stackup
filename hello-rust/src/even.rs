fn main() {
    // Variable assigned with a value of 300
    let max_number = 300;

    // Sequence type to store even numbers
    let mut even_numbers: Vec<i32> = Vec::new();

    // Control flow loop
    for num in 1..=max_number {
        // If-else statement to check if the number is even
        if num % 2 == 0 {
            // Print each even number
            println!("{}", num);

            // Store even numbers in the sequence type
            even_numbers.push(num);
        }
    }

    // Print the sequence type once the loop is exited
    println!("Even numbers stored in the sequence type: {:?}", even_numbers);
}