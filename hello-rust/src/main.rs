use std::f64::consts::PI;

enum Shape<T> {
    Circle(T),
    Triangle(T, T),
    Rectangle(T, T),
}

impl<T: Into<f64> + Copy> Shape<T> {
    fn area(self) -> f64 {
        match self {
            Shape::Circle(diameter) => {
                let radius = diameter.into() / 2.0;
                PI * radius * radius
            }
            Shape::Triangle(base, height) => {
                let base = base.into();
                let height = height.into();
                (base * height) / 2.0
            }
            Shape::Rectangle(width, length) => {
                let width = width.into();
                let length = length.into();
                width * length
            }
        }
    }
}

fn main() {
    let base = 24_u8;
    let height = 24_u8;
    let triangle = Shape::Triangle(base, height);
    let triangle_area = triangle.area();

    let width = 12_u8;
    let length = 24_u8;
    let rectangle = Shape::Rectangle(width, length);
    let rectangular_area = rectangle.area();

    let diameter = 45_u8;
    let circle = Shape::Circle(diameter);
    let circle_area = circle.area();

    println!(
        "The area of the triangle with a base of {} and a height of {} is {:.5}",
        base, height, triangle_area
    );
    println!(
        "The area of the rectangle with a width of {} and a length of {} is {:.5}",
        width, length, rectangular_area
    );
    println!(
        "The area of the circle with a diameter of {} is {:.5}",
        diameter, circle_area
    );
}
