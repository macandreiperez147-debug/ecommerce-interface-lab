import java.math.BigDecimal;

// ================= CUSTOM EXCEPTIONS =================

// Thrown when invalid input is given (e.g., negative deposit)
class InvalidInputException extends Exception {
    public InvalidInputException(String message) {
        super(message);
    }
}

// Thrown when balance is insufficient
class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}

// ================= INTERFACE =================
interface InterestBearing {
    BigDecimal calculateInterest();
}

// ================= ABSTRACT CLASS =================
abstract class Account {
    protected BigDecimal balance;

    public Account(BigDecimal initialBalance) throws InvalidInputException {
        if (initialBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidInputException("Initial balance cannot be negative");
        }
        this.balance = initialBalance;
    }

    // Abstract methods
    public abstract void deposit(BigDecimal amount) throws InvalidInputException;
    public abstract void withdraw(BigDecimal amount)
            throws InvalidInputException, InsufficientFundsException;

    public BigDecimal getBalance() {
        return balance;
    }
}

// ================= SAVINGS ACCOUNT =================
class SavingsAccount extends Account implements InterestBearing {

    public SavingsAccount(BigDecimal initialBalance) throws InvalidInputException {
        super(initialBalance);
    }

    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Deposit must be positive");
        }
        balance = balance.add(amount);
    }

    @Override
    public void withdraw(BigDecimal amount)
            throws InvalidInputException, InsufficientFundsException {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Withdrawal must be positive");
        }

        if (amount.compareTo(balance) > 0) {
            throw new InsufficientFundsException("Not enough balance");
        }

        balance = balance.subtract(amount);
    }

    @Override
    public BigDecimal calculateInterest() {
        // 5% interest example
        return balance.multiply(new BigDecimal("0.05"));
    }
}

// ================= CHECKING ACCOUNT =================
class CheckingAccount extends Account {

    public CheckingAccount(BigDecimal initialBalance) throws InvalidInputException {
        super(initialBalance);
    }

    @Override
    public void deposit(BigDecimal amount) throws InvalidInputException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Deposit must be positive");
        }
        balance = balance.add(amount);
    }

    @Override
    public void withdraw(BigDecimal amount)
            throws InvalidInputException, InsufficientFundsException {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidInputException("Withdrawal must be positive");
        }

        if (amount.compareTo(balance) > 0) {
            throw new InsufficientFundsException("Not enough balance");
        }

        balance = balance.subtract(amount);
    }
}

// ================= MAIN TEST =================
public class MainBank {
    public static void main(String[] args) {
        try {
            SavingsAccount savings = new SavingsAccount(new BigDecimal("1000"));
            savings.deposit(new BigDecimal("500"));
            savings.withdraw(new BigDecimal("200"));

            System.out.println("Savings Balance: " + savings.getBalance());
            System.out.println("Interest: " + savings.calculateInterest());

            CheckingAccount checking = new CheckingAccount(new BigDecimal("500"));
            checking.withdraw(new BigDecimal("100"));

            System.out.println("Checking Balance: " + checking.getBalance());

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}