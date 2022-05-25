import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.ArrayList;
import java.util.Arrays;

public class Tester {

    // Rectangles

    Rectangle r = new Rectangle(100,150,200,250);
    Rectangle r2 = new Rectangle(110,160,210,260);
    Rectangle r3 = new Rectangle(120,150,220,250);

    // R1: 0 rectangles
    @Test
    public void testCountRectanglesR1 (){
        Container c = new Container();
        c.add();
        CountRectangles cR = new CountRectangles(0);
        c.accept(cR);
        Assert.assertEquals(0, cR.summe);
    }

    // R1: 1 rectangles
    @Test
    public void testCountRectanglesR2 (){
        Container c = new Container();
        c.add(r);
        CountRectangles cR = new CountRectangles(0);
        c.accept(cR);
        Assert.assertEquals(1, cR.summe);
    }

    // R1: 3 rectangles
    @Test
    public void testCountRectanglesR3 (){
        Container c = new Container();
        c.add(r);
        c.add(r2);
        c.add(r3);
        CountRectangles cR = new CountRectangles(0);
        c.accept(cR);
        Assert.assertEquals(3, cR.summe);
    }

    // Lines

    Line l = new Line(0,50,100,150);
    Line l2 = new Line(50,0,100,150);
    Line l3 = new Line(0,100,100,100);

    // L1: 0 lines
    @Test
    public void testGetLinesL1 (){
        Container c = new Container();
        c.add();
        GetLines gL = new GetLines(new ArrayList<>());
        c.accept(gL);

        ArrayList<Line> expResult = new ArrayList<>(Arrays.asList());
        Assert.assertEquals(expResult, gL.lines);
    }

    // L2: 1 line
    @Test
    public void testGetLinesL2 (){
        Container c = new Container();
        c.add(l);
        GetLines gL = new GetLines(new ArrayList<>());
        c.accept(gL);

        ArrayList<Line> expResult = new ArrayList<>(Arrays.asList(l));
        Assert.assertEquals(expResult, gL.lines);
    }

    // L1: 3 line
    @Test
    public void testGetLinesL3 (){
        Container c = new Container();
        c.add(l);
        c.add(l2);
        c.add(l3);
        GetLines gL = new GetLines(new ArrayList<>());
        c.accept(gL);

        ArrayList<Line> expResult = new ArrayList<>(Arrays.asList(l, l2, l3));
        Assert.assertEquals(expResult, gL.lines);
    }
}
