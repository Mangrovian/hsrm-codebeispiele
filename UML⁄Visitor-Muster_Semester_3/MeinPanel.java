import java.awt.*;
import java.util.ArrayList;
import javax.swing.*;

public class MeinPanel extends JPanel{

    Container c;
    public MeinPanel(Container c){
        this.c = c;
    }

    @Override
    protected void paintComponent(final Graphics g){
        c.draw(g);
    }

    public static void main(String[] args) {
        JFrame f = new JFrame();
        f.setTitle("Beispiel");
        f.setSize(450,300);
        Container c = new Container();
        Line l = new Line(0,50,100,150);
        Rectangle r = new Rectangle(100,150,200,250);
        c.add(l);
        c.add(r);
        MeinPanel p = new MeinPanel(c);
        f.add(p);
        f.setVisible(true);
    }
}
