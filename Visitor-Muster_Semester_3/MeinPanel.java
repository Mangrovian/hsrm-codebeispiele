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
        Line l2 = new Line(50,0,100,150);
        Line l3 = new Line(0,100,100,100);
        Rectangle r = new Rectangle(100,150,200,250);
        Rectangle r2 = new Rectangle(110,160,210,260);
        Rectangle r3 = new Rectangle(120,150,220,250);
        c.add(l);
        c.add(l2);
        c.add(l3);
        //c.delete(l);
        c.add(r);
        c.add(r2);
        c.add(r3);
        MeinPanel p = new MeinPanel(c);
        f.add(p);
        f.setVisible(true);

        CountRectangles cR = new CountRectangles(0);
        GetLines gL = new GetLines(new ArrayList<>());

        c.accept(cR);
        c.accept(gL);

        int counter = 0;

        for (var x: gL.lines){
            counter++;
        }

        System.out.println("Lines: "+counter);
        System.out.println("Rectangles: "+cR.summe);
    }
}
