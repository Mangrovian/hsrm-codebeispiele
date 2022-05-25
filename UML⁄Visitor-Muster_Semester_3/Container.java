import java.awt.*;
import java.util.ArrayList;

public class Container implements Drawable{

    ArrayList<Drawable> fig = new ArrayList<>();

    @Override
    public void add(Drawable d) {
        fig.add(d);
    }

    @Override
    public void add() {
        return;
    }

    @Override
    public void draw(Graphics g) {
        //System.out.println(fig.size());
        for (Drawable temp: fig){
            temp.draw(g);
        }
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
        for(Drawable x: fig){
            x.accept(v);
        }
    }
}
