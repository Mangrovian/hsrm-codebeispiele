import java.awt.*;
import java.util.ArrayList;

public interface Visitor {

    public default void visit(Rectangle r){
    }

    public default void visit(Line l){
    }

    public default void visit(Container c){
    }


}
