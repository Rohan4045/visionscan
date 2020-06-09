package com.opencvlib;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.opencv.android.OpenCVLoader;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfDouble;
import org.opencv.core.MatOfPoint;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Rect;
import org.opencv.core.RotatedRect;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.CLAHE;
import org.opencv.imgproc.Imgproc;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PointF;
import android.media.Image;
import android.util.Base64;
import android.util.Log;

import org.opencv.android.Utils;
import org.opencv.photo.Photo;
import org.opencv.utils.Converters;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Random;

import com.facebook.react.bridge.Promise;

import static org.opencv.core.Core.BORDER_CONSTANT;
import static org.opencv.core.Core.FILLED;
import static org.opencv.core.CvType.CV_8U;
import static org.opencv.core.CvType.CV_8UC;
import static org.opencv.core.CvType.CV_8UC1;
import static org.opencv.core.CvType.CV_8UC3;

public class ImagecnvModule extends ReactContextBaseJavaModule {


    public ImagecnvModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
        OpenCVLoader.initDebug();
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "Imagecnv";
    }

    @ReactMethod
    public void imgconv(String imageAsBase64, Promise promise) {

        try {


            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inDither = true;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);


//      Bitmap image = decodeSampledBitmapFromFile(imageurl, 2000, 2000);
            int l = CvType.CV_8UC1; //8-bit grey scale image
            Mat matImage = new Mat();
            Utils.bitmapToMat(image, matImage);

            Mat resizedMat = matImage.clone();
            Mat dst = new Mat();
            Mat dst0 = new Mat();
            double width = resizedMat.cols();
            double height = resizedMat.rows();
            double factor = Math.min(1, (float) (1024.0 / width));
            Size sz = new Size(factor * width, factor * height);
            Imgproc.resize(resizedMat, dst, sz);
            Imgproc.cvtColor(dst, dst, Imgproc.COLOR_RGB2GRAY);

            CLAHE clahe = Imgproc.createCLAHE(40, new Size(8, 8));
            clahe.apply(dst, dst0);
            Mat dst2 = dst0.clone();

//            Imgproc.adaptiveThreshold(dst2, dst2,255, Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, Imgproc.THRESH_BINARY, 11, 2);
            Imgproc.threshold(dst2, dst2, 150, 255, Imgproc.THRESH_BINARY + Imgproc.THRESH_OTSU);
//            Imgproc.erode(dst2,dst2,new Mat(),new Point(-1,-1));
            //  Imgproc.GaussianBlur(dst2, dst2, new Size(7, 7), 0);

            //Mat cannyOutput = new Mat();
            // Imgproc.Canny(dst2, cannyOutput,0,80,3,true);


            List<MatOfPoint> contours = new ArrayList<>();
            Mat hierarchy = new Mat();
            Mat drawing = Mat.zeros(dst.size(), CvType.CV_8UC3);
            Imgproc.findContours(dst2, contours, hierarchy, Imgproc.RETR_LIST, Imgproc.CHAIN_APPROX_SIMPLE);
            double maxArea = 0;
            int maxId = -1;
            MatOfPoint2f approxCurve;
            int maxwidth = 0;
            for (MatOfPoint contour : contours) {
                MatOfPoint2f temp = new MatOfPoint2f(contour.toArray());
                double area = Imgproc.contourArea(contour);

                if (area > maxArea) {
                    approxCurve = new MatOfPoint2f();
                    Imgproc.approxPolyDP(temp, approxCurve,
                            Imgproc.arcLength(temp, true) * 0.02, true);

                    if (approxCurve.total() == 4) {

                        Rect rect = Imgproc.boundingRect(approxCurve);
                        if (rect.width > maxwidth || rect.width > 3 * rect.height) {

                            maxwidth = rect.width;
                            maxArea = area;
                            maxId = contours.indexOf(contour);
                        }
                    }
                }
            }



            Mat warped = new Mat();
            Mat roiImage = new Mat();
            Mat dst3 = new Mat();
            Mat dst4 = new Mat();



            if (maxId >= 0) {

                MatOfPoint points = new MatOfPoint(contours.get(maxId));
                Rect rect = Imgproc.boundingRect(points);
//            Imgproc.rectangle(dst, new Point(rect.x,rect.y), new Point(rect.x+rect.width,rect.y+rect.height), new Scalar(0,255,0), 5);

                PointF bottomRight = new PointF(rect.x + rect.width, rect.y + rect.height);
                PointF bottomLeft = new PointF(rect.x, rect.y + rect.height);
                PointF topRight = new PointF(rect.x + rect.width, rect.y);
                PointF topLeft = new PointF(rect.x, rect.y);

                double widthA = Math.sqrt(Math.pow(bottomRight.x - bottomLeft.x, 2) + Math.pow(bottomRight.y - bottomLeft.y, 2));
                double widthB = Math.sqrt(Math.pow(topRight.x - topLeft.x, 2) + Math.pow(topRight.y - topLeft.y, 2));

                double maxWidth = Math.max(widthA, widthB);

                double heightA = Math.sqrt(Math.pow(topRight.x - bottomRight.x, 2) + Math.pow(topRight.y - bottomRight.y, 2));
                double heightB = Math.sqrt(Math.pow(topLeft.x - bottomLeft.x, 2) + Math.pow(topLeft.y - bottomLeft.y, 2));

                double maxHeight = Math.max(heightA, heightB);

                // To apply the final perspective transform I had to create new Matrices
                Point tl = new Point(topLeft.x, topLeft.y);
                Point tr = new Point(topRight.x, topLeft.y);
                Point bl = new Point(bottomLeft.x, bottomLeft.y);
                Point br = new Point(bottomRight.x, bottomRight.y);

                MatOfPoint2f src = new MatOfPoint2f(tl, tr, br, bl);

                MatOfPoint2f dst1 = new MatOfPoint2f(
                        new Point(0, 0), // top left
                        new Point(maxWidth - 1, 0), // top right
                        new Point(maxWidth - 1, maxHeight - 1), // bottom right
                        new Point(0, maxHeight - 1) // bottom left
                );

                Mat perspectiveTransform = Imgproc.getPerspectiveTransform(src, dst1);


                Imgproc.warpPerspective(resizedMat, dst3, perspectiveTransform, new Size(maxWidth, maxHeight));

                Imgproc.cvtColor(dst3, warped, Imgproc.COLOR_BGR2GRAY);

                    // CLAHE clahe1= Imgproc.createCLAHE(40,new Size(8,8));
                    // clahe1.apply(dst3,dst3);
           //   Imgproc.medianBlur(warped,warped,3);
              Imgproc.threshold(warped, warped, 0, 255, Imgproc.THRESH_BINARY_INV+Imgproc.THRESH_OTSU);

//                  Imgproc.adaptiveThreshold(warped, warped,255, Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, Imgproc.THRESH_BINARY_INV,21, 2);
               // int kernelSize = 0;
//                Mat element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2 * kernelSize + 1, 2 * kernelSize + 1), new Point(kernelSize, kernelSize));
//                Imgproc.morphologyEx(warped, warped, Imgproc.MORPH_TOPHAT, element);
            }


    

            Bitmap processedImage = Bitmap.createBitmap(warped.cols(),warped.rows(), Bitmap.Config.ARGB_8888);
            Utils.matToBitmap(warped, processedImage);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            processedImage.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

            promise.resolve(encoded);
            resizedMat.release();
            dst.release();
            dst0.release();
            dst2.release();
            dst3.release();
            dst4.release();
            warped.release();
        } catch (Exception e) {
            promise.reject(e);
        }

    }

    private byte saturate(double v) {
        int iVal = (int) Math.round(v);
        iVal = iVal > 255 ? 255 : (iVal < 0 ? 0 : iVal);
        return (byte) iVal;
    }


    private double angle(Point p1, Point p2, Point p0) {
        double dx1 = p1.x - p0.x;
        double dy1 = p1.y - p0.y;
        double dx2 = p2.x - p0.x;
        double dy2 = p2.y - p0.y;
        return (dx1 * dx2 + dy1 * dy2)
                / Math.sqrt((dx1 * dx1 + dy1 * dy1) * (dx2 * dx2 + dy2 * dy2)
                + 1e-10);
    }



}




















//            Imgproc.Laplacian( dst0, dst1, CvType.CV_16S, 3, 1, 0, Core.BORDER_DEFAULT );
//            Core.convertScaleAbs( dst1, dst2 );
//




//            Mat horizontal = dst1.clone();
//            Mat vertical = dst1.clone();
//            // Specify size on horizontal axis
//            int horizontal_size = horizontal.cols() / 10;
//            // Create structure element for extracting horizontal lines through morphology operations
//            Mat horizontalStructure = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(horizontal_size,1));
//            // Apply morphology operations
//            Imgproc.erode(horizontal, horizontal, horizontalStructure,new Point(-1, -1),3);
//            Imgproc.dilate(horizontal, horizontal, horizontalStructure,new Point(-1, -1),3);
//
//            int vertical_size = vertical.rows() / 25;
//            // Create structure element for extracting vertical lines through morphology operations
//            Mat verticalStructure = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size( 1,vertical_size));
// Apply morphology operations
//            Imgproc.erode(vertical, vertical, verticalStructure,new Point(-1, -1),3);
//            Imgproc.dilate(vertical, vertical, verticalStructure,new Point(-1, -1),3);
//
////            Core.bitwise_not(dst1,dst1);
//            Mat dst3=new Mat();
//            Imgproc.erode(dst1, dst3, new Mat(), new Point(-1, -1), 3);
//            int kernelSize=1;
//            Mat element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2 * kernelSize +1, 2 * kernelSize +1),
//                    new Point(kernelSize, kernelSize));
//            Mat dst4=new Mat();
//
//            Imgproc.morphologyEx(dst3, dst4, Imgproc.MORPH_TOPHAT, element);

//            { int scale = 1;
//            int delta = 0;
//            int ddepth = CvType.CV_16S;
//            Mat grad_x = new Mat(), grad_y = new Mat();
//            Mat abs_grad_x = new Mat(), abs_grad_y = new Mat();
//
//            Imgproc.Sobel( dst1, grad_x, ddepth, 1, 0, 3, scale, delta, Core.BORDER_DEFAULT );
//
//            Imgproc.Sobel( dst1, grad_y, ddepth, 0, 1, 3, scale, delta, Core.BORDER_DEFAULT );
//
//            Core.convertScaleAbs( grad_x, abs_grad_x );
//            Core.convertScaleAbs( grad_y, abs_grad_y );
//            Core.addWeighted( abs_grad_x, 0.5, abs_grad_y, 0.5, 0, dst1);}

//            Imgproc.medianBlur(dst1,dst1,5);

//            Imgproc.adaptiveThreshold(dst, dst, 255, Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, Imgproc.THRESH_BINARY, 21, 21);
//            Imgproc.equalizeHist(dst,dst);
//            Core.bitwise_not(dst,dst);
//            Imgproc.GaussianBlur(dst1, dst1, new Size(7, 7), 0);

//



//    Mat cannyOutput1= new Mat();

//            int kernelSize = 2;
//            Mat element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2 * kernelSize +1, 2 * kernelSize +1),
//                    new Point(kernelSize, kernelSize));
//
//            Imgproc.morphologyEx(cannyOutput, cannyOutput1, Imgproc.MORPH_CLOSE, element);
//            Mat element1 = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2 * kernelSize , 2 * kernelSize ),
//                    new Point(kernelSize, kernelSize));

//  Imgproc.dilate(dst, dst, element);
//            Imgproc.dilate(cannyOutput1, cannyOutput1, new Mat(), new Point(-1, -1), 4);
//            Imgproc.erode(cannyOutput1, cannyOutput1, new Mat(), new Point(-1, -1), 3);

//            int scale = 1;
//            int delta = 0;
//            int ddepth = CvType.CV_16S;
//            Mat grad_x = new Mat(), grad_y = new Mat();
//            Mat abs_grad_x = new Mat(), abs_grad_y = new Mat();
//
//            Imgproc.Scharr( dst, grad_x, ddepth, 1, 0, scale, delta, Core.BORDER_DEFAULT );
//
//            Imgproc.Scharr( dst, grad_y, ddepth, 0, 1, scale, delta, Core.BORDER_DEFAULT );
//
//            Core.convertScaleAbs( grad_x, abs_grad_x );
//            Core.convertScaleAbs( grad_y, abs_grad_y );
//            Core.addWeighted( abs_grad_x, 0.5, abs_grad_y, 0.5, 0, dst );


//
//            Mat cdst=new Mat();
//            Imgproc.cvtColor(dst0, cdst, Imgproc.COLOR_GRAY2BGR);
//            Mat lines = new Mat(); // will hold the results of  the detection
//            Imgproc.HoughLines(dst0, lines, 1, Math.PI/180, 150); // runs the actual detection
//            for (int x = 0; x < lines.rows(); x++) {
//                double rho = lines.get(x, 0)[0],
//                        theta = lines.get(x, 0)[1];
//                double a = Math.cos(theta), b = Math.sin(theta);
//                double x0 = a*rho, y0 = b*rho;
//                Point pt1 = new Point(Math.round(x0 + 1000*(-b)), Math.round(y0 + 1000*(a)));
//                Point pt2 = new Point(Math.round(x0 - 1000*(-b)), Math.round(y0 - 1000*(a)));
//                Imgproc.line(cdst, pt1, pt2, new Scalar(0, 0, 255), 3, Imgproc.LINE_AA, 0);
//            }




//            Imgproc.dilate(cannyOutput, cannyOutput, new Mat(), new Point(-1, -1), 2);
//            int kernelSize = 1;
//            Mat element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2 * kernelSize , 2 * kernelSize ),
//                    new Point(kernelSize, kernelSize));
//            Imgproc.dilate(cannyOutput, cannyOutput, element);


//Gamma correction
////            Mat lookUpTable = new Mat(1, 256, CvType.CV_8U);
////            byte[] lookUpTableData = new byte[(int) (lookUpTable.total()*lookUpTable.channels())];
////            for (int i = 0; i < lookUpTable.cols(); i++) {
////                lookUpTableData[i] = saturate(Math.pow(i / 255.0, 2.39) * 255.0);//2.39 is gamma value
////            }
////            lookUpTable.put(0, 0, lookUpTableData);
////
////            Core.LUT(dst0, lookUpTable, dst1);



////
////
////            Imgproc.pyrDown(resizedMat,dst,new Size(resizedMat.cols()/2,resizedMat.rows()/2));
////            Imgproc.pyrUp(dst,dst0,resizedMat.size());
////            double width = resizedMat.cols();
////            double height = resizedMat.rows();
////            double factor = Math.min(1, (float) (1024.0 / width));
////            Size sz = new Size(factor * width, factor * height);
////            Imgproc.resize(resizedMat, dst, sz);
////
////            Mat dst1=new Mat();
////            Mat dst2=new Mat();
////
////



////            Imgproc.equalizeHist(dst1,dst2);
//
////            Core.normalize(dst2,dst2,0,255, Core.NORM_MINMAX);
//
////            Imgproc.adaptiveThreshold(dst2, dst2,100, Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, Imgproc.THRESH_BINARY, 11, 2);
////            Imgproc.medianBlur(dst2,dst2,3);






//
//                MatOfPoint2f newmat = new MatOfPoint2f(contours.get(maxId).toArray());
//                RotatedRect rect = Imgproc.minAreaRect(newmat);
//
//                double angle = rect.angle;
//                if (angle < -45.)
//                    angle += 90.;
//
//                Point points[] = new Point[4];
//
//                rect.points(points);
//                for (int i = 0; i < 4; ++i) {
//                    Imgproc.line(resizedMat, points[i], points[(i + 1) % 4], new Scalar(0, 255, 0));
//                }
//
//                Mat rot = Imgproc.getRotationMatrix2D(rect.center, angle, 1);
//                Mat rotated = new Mat();
//                Imgproc.warpAffine(resizedMat, rotated, rot, dst.size(), Imgproc.INTER_NEAREST);
//
//                Size box_size = rect.size;
//                if (rect.angle < -45.) {
//                    double temp = box_size.width;
//                    box_size.width = box_size.height;
//                    box_size.height = temp;
//                }
//
//                Mat cropped = new Mat();
//            Mat cropped1 = new Mat();
//                Imgproc.getRectSubPix(rotated, box_size, rect.center, cropped);
//            Imgproc.pyrDown(cropped,cropped1,new Size(cropped.cols()/2,cropped.rows()/2));




//    Mat floodfilled = Mat.zeros(warped.rows() + 2, warped.cols() + 2, CvType.CV_8U);
//            Imgproc.floodFill(cannyOutput, floodfilled, new Point(0, 0), new Scalar(255), new Rect(), new Scalar(0), new Scalar(0), 4 + (255 << 8) + Imgproc.FLOODFILL_MASK_ONLY);
//
//                    Core.subtract(floodfilled, Scalar.all(0), floodfilled);
//
//                    Rect roi = new Rect(1, 1, warped.cols() - 2, warped.rows() - 2);
//                    Mat temp = new Mat();
//
//                    floodfilled.submat(roi).copyTo(temp);
//
//                    warped = temp;



//    MatOfPoint maxMatOfPoint = contours.get(maxId);
//                    MatOfPoint2f maxMatOfPoint2f = new MatOfPoint2f(maxMatOfPoint.toArray());
//                    RotatedRect rect = Imgproc.minAreaRect(maxMatOfPoint2f);
//
//                    Point points[] = new Point[4];
//                    rect.points(points);
//
//                    for (int i = 0; i < 4; ++i) {
//                        Imgproc.line(resizedMat, points[i], points[(i + 1) % 4], new Scalar(255, 0, 0), 2);
////                        Imgproc.circle(matImage, points[i], 10, new Scalar(255, 0, 0), 5);
//                    }
//                }


//  Imgproc.equalizeHist(warped,warped);
//          int scale = 1;
//          int delta = 0;
//          int ddepth = CvType.CV_16S;
//          Mat grad_x = new Mat(), grad_y = new Mat();
//          Mat abs_grad_x = new Mat(), abs_grad_y = new Mat();
//
//          Imgproc.Sobel( warped, grad_x, ddepth, 1, 0, 3, scale, delta, Core.BORDER_DEFAULT );
//
//          Imgproc.Sobel( warped, grad_y, ddepth, 0, 1, 3, scale, delta, Core.BORDER_DEFAULT );
//
//          Core.convertScaleAbs( grad_x, abs_grad_x );
//          Core.convertScaleAbs( grad_y, abs_grad_y );
//          Core.addWeighted( abs_grad_x, 0.5, abs_grad_y, 0.5, 0, dst4);


//Core.bitwise_not(img, img);


//            Imgproc.threshold(cropped, cropped, 10, 255, Imgproc.THRESH_BINARY+Imgproc.THRESH_OTSU);
// Imgproc.adaptiveThreshold(cropped, cropped,255, Imgproc.ADAPTIVE_THRESH_GAUSSIAN_C, Imgproc.THRESH_BINARY_INV,11, 2);
//            int kernelSize = 0;
//            Mat element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2 * kernelSize + 1, 2 * kernelSize + 1), new Point(kernelSize, kernelSize));
//
//            Imgproc.morphologyEx(cropped, cropped, Imgproc.MORPH_CLOSE, element);



    //int wid=0,h=0;
//                for(int i=0;i<digits.size();i++){
//                    Mat n= digits.get(i);
//                    wid=wid+n.width();
//                    h=n.height();
//                }

//            int left=5;
//
//            Mat dispimage= Mat.zeros(new Size(100+digits.size()*wid,60+h),CV_8UC3);
//                Core.hconcat(digits,dispimage);
//                for(int i=0;i<digits.size();i++){
//                    Mat img=digits.get(i);
//                    int x=img.cols();//width
//                    int y=img.rows();//height
//                    int m=(dispimage.height()-y)/2;
//                    int n=(dispimage.height()-y)/2;
//
//                    int right=dispimage.width()-(left+x);
//                  //  int max = (x > y)? x: y;
//
//               //    float scale = (float) ( (float) max / digits.size() );
////                    if(i%digits.indexOf(i)==0 && m!=20){
////                        m=20;
////                        n+=20+img.width();
////                    }
//    //                Rect ROI=new Rect(m,n,(int)( x/scale ), (int)( y/scale ));
//
//                    img.copyTo(dispimage.);
//                    left=left+x+5;
//
//                }
////            Mat dispimage= new Mat(new Size(1000,200),CV_8UC1,new Scalar(255,255,255));
//            int x, y;
//            float scale;
//            int max;
//            for(int i=0,m=20,n=20; i<mRoiImages.size();i++){
//                Mat img=digits.get(i);
//                x=img.cols();
//                y=img.rows();
//                max = (x > y)? x: y;
//
////                scale = (float) ( (float) max / digits.size() );
//                if(i%digits.indexOf(i)==0 && m!=20){
//                    m=20;
//                    n+=20+img.width();
//                }
////                Rect ROI=new Rect(m,n,(int)( x/scale ), (int)( y/scale ));
//
//                img.copyTo(dispimage.adjustROI(m,n,x,y));
//                m+=(20+x);
//
//            }

//                Mat cannyOutput = new Mat();
//                Imgproc.Canny(dst3, cannyOutput, 150, 250, 3, false);
//                Imgproc.GaussianBlur(cannyOutput,cannyOutput,new Size(1,1),0);

             //   List<Mat> digits = new ArrayList<>();
              //  List<MatOfPoint> Contours = new ArrayList<>();
              //  Mat mask=new Mat(warped.rows(),warped.cols(), CV_8UC1, new Scalar(0,0,0));

              //  Imgproc.findContours(cannyOutput, Contours, new Mat(), Imgproc.RETR_TREE, Imgproc.CHAIN_APPROX_SIMPLE);

                // code to sort contours
                // code to check that contour is a valid char

//                for (int i = 0; i < Contours.size(); i++) {
//
//                    MatOfPoint2f approxCurve1 = new MatOfPoint2f();
//                    MatOfPoint2f contour2f = new MatOfPoint2f(Contours.get(i).toArray());
//
//                    //Processing on mMOP2f1 which is in type MatOfPoint2f
//                    double approxDistance = Imgproc.arcLength(contour2f, true) * 0.02;
//                    Imgproc.approxPolyDP(contour2f, approxCurve1, approxDistance, true);
//
//                    //Convert back to MatOfPoint
//                    MatOfPoint points = new MatOfPoint(approxCurve1.toArray());
//
//
//                        // Get bounding rect of contour
//                        Rect rect = Imgproc.boundingRect(points);
//
//                        if (rect.width < rect.height) {
//                            Imgproc.rectangle(dst3, new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y + rect.height), new Scalar(0, 255, 0), 5);
////                    Imgproc.rectangle(mask, new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y + rect.height), new Scalar(255, 255, 255  ), -1,8,0);
//////                    roiImage = dst3.submat(rect.y,rect.y + rect.height ,rect.x,rect.x + rect.width );
////                }
//                            if ((rect.y + rect.height > dst3.rows()) || (rect.x + rect.width > dst3.cols())) {
//                                continue;
//                            }
//
//                        }
//
//
//
//                }
//            int top, bottom, left, right;
//            int borderType = Core.BORDER_CONSTANT;
//            Random rng;
//            rng = new Random();
//            Scalar value = new Scalar( rng.nextInt(256),
//                    rng.nextInt(256), rng.nextInt(256) );
//            top = (int) (0.05*dst3.rows()); bottom = top;
//            left = (int) (0.05*dst3.cols()); right = left;
//            Core.copyMakeBorder( dst3, dst3, top, bottom, left, right, borderType, value);


//
//            Core.hconcat(digits,dst4);
//            Mat dst1=new Mat();
//            Mat cropped = new Mat();
//            warped.copyTo( cropped, mask );

//            Mat lookUpTable = new Mat(1, 256, CvType.CV_8U);
//            byte[] lookUpTableData = new byte[(int) (lookUpTable.total()*lookUpTable.channels())];
//            for (int i = 0; i < lookUpTable.cols(); i++) {
//                lookUpTableData[i] = saturate(Math.pow(i / 255.0, 2.38) * 255.0);//2.39 is gamma value
//            }
//            lookUpTable.put(0, 0, lookUpTableData);
//
//            Mat dst4=new Mat();
//            double alpha=4;
//            int beta=80;
//            Core.LUT(cropped, lookUpTable, dst1);
//            cropped.convertTo(dst4, -1, alpha, beta);





