fn main() {
    
    let max_number = 300;
    let mut even_numbers: Vec<i32> = Vec::new();

    for num in 1..=max_number {
        if num % 2 == 0 {

            even_numbers.push(num);
        }
    }
   
    for num in even_numbers.iter().rev() {
        println!("{}", num);
    }
    println!("{:?}", even_numbers.iter().rev().collect::<Vec<&i32>>())
}
