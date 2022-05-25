import java.awt.*;
import java.util.ArrayList;

public interface Drawable {

    public void add(Drawable d);
    public void draw(Graphics g);
    public ArrayList<Drawable> getDrawables();
    public void delete(Drawable d);
    public void accept(Visitor v);

}
