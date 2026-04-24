import java.util.*;
import java.util.stream.Collectors;

// Record (immutable)
record Order(Long orderId, String description, int amount) {}

public class MainOrders {

    // Generator method
    static List<Order> orderGenerator(int numberOfOrders) {
        if (numberOfOrders < 100) {
            throw new RuntimeException("Invalid value");
        }

        var generatedOrder = new ArrayList<Order>();

        for (var i = 0; i <= numberOfOrders; i++) {
            long orderId = (int) (Math.random() * 10);
            generatedOrder.add(new Order(
                    orderId,
                    "Order " + orderId,
                    (int) (Math.random() * 200)
            ));
        }

        return generatedOrder;
    }

    public static void main(String[] args) {

        // 1. Generate orders
        var orders = orderGenerator(100);

        System.out.println("=== ALL ORDERS ===");
        for (var order : orders) {
            System.out.println(order);
        }

        // 2. Add new order + sort descending by amount
        orders.add(new Order(999L, "Special Order", 180));

        orders.sort((a, b) -> b.amount() - a.amount());

        System.out.println("\n=== SORTED ORDERS (DESC) ===");
        orders.forEach(System.out::println);

        // 3. Filter >150 and map descriptions
        var filteredDescriptions = orders.stream()
                .filter(o -> o.amount() > 150)
                .map(Order::description)
                .toList();

        System.out.println("\n=== ORDERS > 150 (Descriptions) ===");
        filteredDescriptions.forEach(System.out::println);

        // 4. Average amount
        double avg = orders.stream()
                .mapToInt(Order::amount)
                .average()
                .orElse(0);

        System.out.println("\nAverage Amount: " + avg);

        // 5. Group by description and sum amounts
        var grouped = orders.stream()
                .collect(Collectors.groupingBy(
                        Order::description,
                        Collectors.summingInt(Order::amount)
                ));

        System.out.println("\n=== GROUPED TOTALS ===");
        grouped.forEach((desc, total) ->
                System.out.println(desc + " -> " + total));
    }
}