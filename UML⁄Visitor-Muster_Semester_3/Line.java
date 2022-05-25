import java.awt.*;
import java.util.ArrayList;

public class Line implements Drawable{

    ArrayList<Drawable> fig = new ArrayList<>();
    int x1, y1, x2, y2;

    public Line(int x1, int y1, int x2, int y2){
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
    @Override
    public void add(Drawable d) {
        return;
    }

    @Override
    public void add() {
        fig.add(null);
    }

    @Override
    public void draw(Graphics g) {
        g.drawLine(x1,y1,x2,y2);
    }

    @Override
    public ArrayList<Drawable> getDrawables() {
        return fig;
    }

    @Override
    public void delete(Drawable d) {
        fig.remove(d);
    }

    @Override
    public void accept(Visitor v) {
        v.visit(this);
    }
}
