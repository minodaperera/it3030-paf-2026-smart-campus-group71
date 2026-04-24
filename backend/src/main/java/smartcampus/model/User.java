package smartcampus.model;

import jakarta.persistence.*;
import lombok.Data; // Import Lombok

@Entity
@Table(name = "users")
@Data // This generates all getters, setters, and constructors automatically
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String role;
}