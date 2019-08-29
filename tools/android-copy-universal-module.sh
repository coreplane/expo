#!/usr/bin/env bash
# Usage: ./android-copy-universal-module 4.0.0 universal-module/.../android

ABI_VERSION=`echo $1 | sed 's/\./_/g'`
ABI_VERSION="abi$ABI_VERSION"
VERSIONED_ABI_PATH=versioned-abis/expoview-$ABI_VERSION

pushd ../android

cp -r $2/src/main/java/* $VERSIONED_ABI_PATH/src/main/java/$ABI_VERSION
cp -r $2/src/main/AndroidManifest.xml $VERSIONED_ABI_PATH/src/main/AndroidManifestTemp.xml

# Rename references to other packages previously under versioned.host.exp.exponent

find $VERSIONED_ABI_PATH/src/main/java/$ABI_VERSION -iname 'flutter' -type d -print0 | xargs -0 rm -r

while read PACKAGE
do
  find $VERSIONED_ABI_PATH/src/main/java/$ABI_VERSION \( -iname '*.java' -or -iname '*.kt' \) -type f -print0 | xargs -0 sed -i '' "s/\([, ^\(]\)$PACKAGE/\1temporarydonotversion.$PACKAGE/g"
  sed -i '' "s/\([, ^\(]\)$PACKAGE/\1temporarydonotversion.$PACKAGE/g" $VERSIONED_ABI_PATH/src/main/AndroidManifestTemp.xml
done < ../tools/android-packages-to-keep.txt

# Rename references to react native
while read PACKAGE
do
  find $VERSIONED_ABI_PATH/src/main/java/$ABI_VERSION \( -iname '*.java' -or -iname '*.kt' \) -type f -print0 | xargs -0 sed -i '' "s/\([, ^\(]\)$PACKAGE/\1$ABI_VERSION.$PACKAGE/g"
  sed -i '' "s/\([, ^\(]\)$PACKAGE/\1$ABI_VERSION.$PACKAGE/g" $VERSIONED_ABI_PATH/src/main/AndroidManifestTemp.xml
done < ../tools/android-packages-to-rename.txt

while read PACKAGE
do
  find $VERSIONED_ABI_PATH/src/main/java/$ABI_VERSION \( -iname '*.java' -or -iname '*.kt' \) -type f -print0 | xargs -0 sed -i '' "s/\([, ^\(]\)temporarydonotversion.$PACKAGE/\1$PACKAGE/g"
  sed -i '' "s/\([, ^\(]\)temporarydonotversion.$PACKAGE/\1$PACKAGE/g" $VERSIONED_ABI_PATH/src/main/AndroidManifestTemp.xml
done < ../tools/android-packages-to-keep.txt

DIR=$(pwd)

popd

java -jar mergerer/target/manifest-merger-jar-with-dependencies.jar  --main $DIR/$VERSIONED_ABI_PATH/src/main/AndroidManifest.xml  --libs $DIR/$VERSIONED_ABI_PATH/src/main/AndroidManifestTemp.xml --out $DIR/$VERSIONED_ABI_PATH/src/main/AndroidManifest.xml --log WARNING

rm $DIR/$VERSIONED_ABI_PATH/src/main/AndroidManifestTemp.xml
